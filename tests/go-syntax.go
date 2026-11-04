// Read Go's own syntax tree and scanner tokens for exact course examples.
// Usage: go run tests/go-syntax.go INPUT_EXAMPLES OUTPUT_TOKENS
package main

import (
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/scanner"
	"go/token"
	"os"
	"reflect"
	"regexp"
	"sort"
	"strings"
)

type Example struct{ ID, Code string }
type Part struct {
	A, B                        int
	Text, Kind, Path, Call, Obj string
	Decl                        bool
}
type Row struct {
	ID    string
	Parts []Part
}
type Node struct {
	n     ast.Node
	path  string
	depth int
}

func must(e error) {
	if e != nil {
		panic(e)
	}
}
func nodeName(n ast.Node) string { return strings.TrimPrefix(fmt.Sprintf("%T", n), "*ast.") }
func fieldName(p, c ast.Node) string {
	v := reflect.ValueOf(p).Elem()
	t := v.Type()
	for i := 0; i < v.NumField(); i++ {
		f := v.Field(i)
		if !f.CanInterface() {
			continue
		}
		if n, ok := f.Interface().(ast.Node); ok && n == c {
			return t.Field(i).Name
		}
		if f.Kind() == reflect.Slice {
			for j := 0; j < f.Len(); j++ {
				if n, ok := f.Index(j).Interface().(ast.Node); ok && n == c {
					return t.Field(i).Name
				}
			}
		}
	}
	return ""
}
func goParts(name, s string, base int) []Part {
	fset := token.NewFileSet()
	tree, e := parser.ParseFile(fset, name, s, parser.ParseComments)
	must(e)
	file := fset.File(tree.Pos())
	var nodes, stack []Node
	ast.Inspect(tree, func(n ast.Node) bool {
		if n == nil {
			stack = stack[:len(stack)-1]
			return false
		}
		path := nodeName(n)
		if len(stack) > 0 {
			p := stack[len(stack)-1]
			path = p.path + "." + fieldName(p.n, n) + "/" + path
		}
		info := Node{n, path, len(stack)}
		nodes = append(nodes, info)
		stack = append(stack, info)
		return true
	})
	var scan scanner.Scanner
	scan.Init(file, []byte(s), func(pos token.Position, msg string) { panic(pos.String() + ": " + msg) }, scanner.ScanComments)
	var parts []Part
	for {
		pos, tok, lit := scan.Scan()
		if tok == token.EOF {
			break
		}
		if tok == token.SEMICOLON && lit == "\n" {
			continue
		}
		if lit == "" {
			lit = tok.String()
		}
		a := file.Offset(pos)
		b := a + len(lit)
		if s[a:b] != lit {
			panic("scanner source mismatch")
		}
		part := Part{A: base + a, B: base + b, Text: lit, Kind: tok.String()}
		deep := -1
		callDepth := -1
		idPath := ""
		for _, z := range nodes {
			n := z.n
			if n.Pos() > pos || n.End() < pos+token.Pos(len(lit)) {
				continue
			}
			if z.depth >= deep {
				part.Path = z.path
				deep = z.depth
			}
			if call, ok := n.(*ast.CallExpr); ok && z.depth >= callDepth {
				part.Call = s[file.Offset(call.Fun.Pos()):file.Offset(call.Fun.End())]
				callDepth = z.depth
			}
			if id, ok := n.(*ast.Ident); ok && id.Pos() == pos && tok == token.IDENT {
				idPath = z.path
				if id.Obj != nil {
					part.Obj = id.Obj.Kind.String()
					part.Decl = id.Obj.Pos() == pos
				}
			}
		}
		if idPath != "" {
			part.Path = idPath
		}
		parts = append(parts, part)
	}
	return parts
}
func main() {
	b, e := os.ReadFile(os.Args[1])
	must(e)
	var ex []Example
	must(json.Unmarshal(b, &ex))
	var rows []Row
	fm := regexp.MustCompile("(?m)^// File: ([^\\r\\n]+)\\n")
	mt := regexp.MustCompile("[^\\s]+")
	for _, ex := range ex {
		r := Row{ID: ex.ID}
		marks := fm.FindAllStringSubmatchIndex(ex.Code, -1)
		if len(marks) == 0 {
			r.Parts = goParts(ex.ID+".go", ex.Code, 0)
		} else {
			for i, m := range marks {
				name := ex.Code[m[2]:m[3]]
				r.Parts = append(r.Parts, Part{A: m[0], B: m[1] - 1, Text: ex.Code[m[0] : m[1]-1], Kind: "FILE"})
				end := len(ex.Code)
				if i+1 < len(marks) {
					end = marks[i+1][0]
				}
				src := ex.Code[m[1]:end]
				if strings.HasSuffix(name, ".go") {
					r.Parts = append(r.Parts, goParts(name, src, m[1])...)
				} else if strings.HasSuffix(name, "go.mod") {
					for _, p := range mt.FindAllStringIndex(src, -1) {
						lineStart := strings.LastIndex(src[:p[0]], "\n") + 1
						lineEnd := strings.Index(src[lineStart:], "\n")
						if lineEnd < 0 {
							lineEnd = len(src) - lineStart
						}
						line := strings.Fields(src[lineStart : lineStart+lineEnd])
						r.Parts = append(r.Parts, Part{A: m[1] + p[0], B: m[1] + p[1], Text: src[p[0]:p[1]], Kind: "MODULE", Path: line[0]})
					}
				} else {
					panic("unknown file " + name)
				}
			}
		}
		sort.Slice(r.Parts, func(i, j int) bool { return r.Parts[i].A < r.Parts[j].A })
		rows = append(rows, r)
	}
	out, e := json.Marshal(rows)
	must(e)
	must(os.WriteFile(os.Args[2], out, 0644))
	fmt.Println("Parsed", len(rows), "exact Go examples.")
}
