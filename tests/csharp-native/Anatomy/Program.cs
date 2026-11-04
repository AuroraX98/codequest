using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

string root = Path.GetFullPath(args[0]);
var refs = ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!).Split(Path.PathSeparator).Select(p => MetadataReference.CreateFromFile(p)).ToArray();
var examples = JsonDocument.Parse(File.ReadAllText(Path.Combine(root,"docs/csharp-wording-v1/examples.json"))).RootElement;
var rows = new List<Example>();
var unknown = new List<object>();
foreach (var item in examples.EnumerateArray())
{
    string id = item.GetProperty("id").GetString()!, source = item.GetProperty("code").GetString()!;
    var tree = CSharpSyntaxTree.ParseText(source, new CSharpParseOptions(LanguageVersion.CSharp14));
    var compilation = CSharpCompilation.Create(id, new[] { tree }, refs, new CSharpCompilationOptions(OutputKind.ConsoleApplication, nullableContextOptions: NullableContextOptions.Enable));
    var errors = compilation.GetDiagnostics().Where(d=>d.Severity==DiagnosticSeverity.Error).ToArray();
    if(errors.Length>0) throw new Exception(string.Join("\n",errors.Select(e=>e.ToString())));
    var model = compilation.GetSemanticModel(tree);
    var parts = new List<object[]>();
    foreach(var token in tree.GetRoot().DescendantTokens())
    {
        if(token.Span.Length==0) continue;
        var m=Describe(token, model);
        parts.Add(new object[]{token.Span.Start,token.Span.End,m.Label,m.Text,m.Tone});
        if(m.Label=="Code") unknown.Add(new {id,text=token.Text,kind=token.Kind().ToString(),parent=token.Parent?.Kind().ToString()});
    }
    foreach(var trivia in tree.GetRoot().DescendantTrivia())
    {
        if(trivia.IsKind(SyntaxKind.SingleLineCommentTrivia)||trivia.IsKind(SyntaxKind.MultiLineCommentTrivia)) parts.Add(new object[]{trivia.Span.Start,trivia.Span.End,"Comment","A note for readers. C# does not run it.","gray"});
        else if(trivia.HasStructure) parts.Add(new object[]{trivia.Span.Start,trivia.Span.End,"Compiler setting","Sets a compiler rule for this file. Here, nullable enable turns on missing-reference warnings.","purple"});
    }
    rows.Add(new Example(id,source,parts.OrderBy(p=>(int)p[0]).ToArray()));
}
var options=new JsonSerializerOptions{WriteIndented=false};
var meanings=new List<string[]>(); var meaningIndex=new Dictionary<string,int>();
var compactRows=rows.Select(row=>new {row.id,row.source,parts=row.parts.Select(part=>{
    var meaning=part.Skip(2).Cast<string>().ToArray();string key=string.Join("\0",meaning);
    if(!meaningIndex.TryGetValue(key,out int index)){index=meanings.Count;meanings.Add(meaning);meaningIndex.Add(key,index);}
    return new int[]{(int)part[0],(int)part[1],index};
}).ToArray()}).ToArray();
string output="// Generated from the exact reviewed examples with Roslyn (C# 14 / .NET SDK 10.0.403).\n// Regenerate with tests/csharp-native/Anatomy; never reuse ranges for changed source.\nexport type CSharpPart = [number, number, number];\nexport const csharpMeanings: [string,string,string][] = "+JsonSerializer.Serialize(meanings,options)+";\nexport const reviewedCSharpAnatomy: {id:string; source:string; parts:CSharpPart[]}[] = "+JsonSerializer.Serialize(compactRows,options)+";\n";
File.WriteAllText(Path.Combine(root,"lib/csharp-reviewed-anatomy.ts"),output);
File.WriteAllText(Path.Combine(root,"docs/csharp-wording-v1/anatomy-unclassified.json"),JsonSerializer.Serialize(unknown,new JsonSerializerOptions{WriteIndented=true})+"\n");
Console.WriteLine($"Generated {rows.Count} exact-source examples; {unknown.Count} unclassified tokens.");

static Description D(string label,string text,string tone="purple")=>new(label,text,tone);
static Description Describe(SyntaxToken t,SemanticModel model)
{
    var p=t.Parent!; string text=t.Text, kind=t.Kind().ToString();
    bool Has<T>() where T:SyntaxNode => p.AncestorsAndSelf().OfType<T>().Any();
    if(kind.Contains("StringLiteralToken")) return D("Text","Text inside quotes. The outside quote marks are not part of the stored text.","green");
    if(t.IsKind(SyntaxKind.CharacterLiteralToken)) return D("Character","One UTF-16 code unit, written inside single quotes. Some visible symbols need more than one code unit.","green");
    if(t.IsKind(SyntaxKind.NumericLiteralToken)) return D("Number","A numeric value. A suffix such as m selects its number type.","orange");
    if(t.IsKind(SyntaxKind.InterpolatedStringTextToken)) return D("Message text","Text included directly in this message.","green");
    if(kind.StartsWith("Interpolated")&&kind.Contains("StartToken")) return D("Start message","Starts text that can insert values between braces.","green");
    if(t.IsKind(SyntaxKind.InterpolatedStringEndToken)) return D("End message","Ends this message's text.","green");
    if(p is InterpolationSyntax && text=="{") return D("Insert value","Starts the expression whose value is inserted into the text.");
    if(p is InterpolationSyntax && text=="}") return D("End inserted value","Ends the expression inserted into the text.");
    if(text=="var" && p is IdentifierNameSyntax && p.Parent is VariableDeclarationSyntax v && v.Type==p) return D("Infer type","Asks C# to work out the variable's type from its starting value. The type still stays fixed.");
    if(text=="field" && p.Kind().ToString()=="FieldExpression") return D("Property storage","The compiler-created storage for this property. Assigning here saves its new value.","blue");
    if(p is DiscardPatternSyntax) return D("Fallback pattern","Matches any input left over after the earlier choices.");
    if(t.IsKind(SyntaxKind.IdentifierToken))
    {
        if(p is TupleElementSyntax) return D("Name a tuple part","Names this part of the tuple so it can be read with a dot.","blue");
        ISymbol? symbol=null;
        if(p is VariableDeclaratorSyntax or ParameterSyntax or BaseTypeDeclarationSyntax or MethodDeclarationSyntax or LocalFunctionStatementSyntax or ConstructorDeclarationSyntax or PropertyDeclarationSyntax or TypeParameterSyntax or EnumMemberDeclarationSyntax or SingleVariableDesignationSyntax or ForEachStatementSyntax)
            symbol=model.GetDeclaredSymbol(p);
        if(symbol==null) symbol=model.GetSymbolInfo(p).Symbol;
        if(symbol==null && p is IdentifierNameSyntax name && name.Parent is NameColonSyntax) symbol=model.GetSymbolInfo(name).Symbol;
        if(symbol is IMethodSymbol method)
        {
            if(p is ConstructorDeclarationSyntax) return D("Define constructor","Names the code that sets up a new object of this class.","blue");
            if(p is MethodDeclarationSyntax or LocalFunctionStatementSyntax) return D("Define method","Gives this reusable group of instructions its name. Defining it does not call it yet.","blue");
            bool called=p.AncestorsAndSelf().OfType<InvocationExpressionSyntax>().Any(i=>i.Expression.Span.Contains(t.Span));
            if(!called) return D("Pass method","Refers to this method so other code can call it later.","blue");
            string owner=method.ContainingType?.OriginalDefinition.ToDisplayString()??"";
            var known=Builtin(owner,method.Name);
            return known??D("Call method","Calls "+method.Name+" with the supplied inputs. Its definition describes the work and result.","blue");
        }
        if(symbol is INamespaceSymbol) return D("Namespace","Names a group of types. Dots can join the parts of a longer name.","blue");
        if(symbol is INamedTypeSymbol type)
        {
            bool definition=p is BaseTypeDeclarationSyntax;
            return D(definition?"Define type":"Type",definition?"Names this new "+type.TypeKind.ToString().ToLowerInvariant()+" definition.":"Names the kind of value or object used here: "+type.Name+".","blue");
        }
        if(symbol is ITypeParameterSymbol) return D("Type placeholder","A name for the type chosen when this generic code is used.","blue");
        if(symbol is ILocalSymbol) return D(p is VariableDeclaratorSyntax or SingleVariableDesignationSyntax or ForEachStatementSyntax?"Name a variable":"Variable",p is VariableDeclaratorSyntax or SingleVariableDesignationSyntax or ForEachStatementSyntax?"Names a local place for the value being declared.":"Uses this local variable. The surrounding instruction decides whether to read or replace its value.","blue");
        if(symbol is IParameterSymbol parameter)
        {
            if(text=="value"&&parameter.IsImplicitlyDeclared) return D("Incoming value","The new value being offered to this property setter.","blue");
            if(p is ParameterSyntax) return D("Name an input","Names a parameter, an input this function receives.","blue");
            if(p.Parent is NameColonSyntax) return D("Named input","Names the parameter receiving the supplied argument.","blue");
            return D("Input variable","Uses the value held by this function's input parameter.","blue");
        }
        if(symbol is IPropertySymbol prop)
        {
            if(prop.Name=="Length"&&prop.ContainingType.SpecialType==SpecialType.System_String) return D("Text length","Counts the string's UTF-16 units. Some visible symbols need more than one unit.","blue");
            if(prop.Name=="Length"&&prop.ContainingType.SpecialType==SpecialType.System_Array) return D("Array length","The total number of array elements, not its last index.","blue");
            return D(p is PropertyDeclarationSyntax?"Define property":"Property",p is PropertyDeclarationSyntax?"Names a value accessed through get or set code.":"Accesses the named property through its getter or setter.","blue");
        }
        if(symbol is IEventSymbol) return D("Event","Names an event that handlers can subscribe to or unsubscribe from.","blue");
        if(symbol is IFieldSymbol field)
        {
            if(field.ContainingType.TypeKind==TypeKind.Enum) return D("Enum choice","One of the named values in this enum.","blue");
            return D(p is VariableDeclaratorSyntax?"Define field":"Field","Names stored data belonging to an object, or to its type when marked static.","blue");
        }
        return D("Name","A name used by the surrounding C# instruction.","blue");
    }
    if(text=="using") return p is UsingDirectiveSyntax?D("Use namespace","Makes names from this namespace available without their full spelling."):D("Arrange cleanup","Calls Dispose when this using block or enclosing scope ends.");
    if(text=="in"&&p is ForEachStatementSyntax) return D("Sequence to visit","The sequence after in supplies the values visited by foreach.");
    if(text=="return"&&p is YieldStatementSyntax) return D("Offer next value","Together with yield, supplies one value and pauses this iterator.");
    if(text=="this"&&p is ParameterSyntax) return D("Extension input","Marks the first input as the value before the dot in an extension call.");
    if(text=="is") return D("Matches pattern","Checks whether the value matches the pattern that follows.");
    var words=new Dictionary<string,(string,string)>{
        ["int"]=("Whole-number type","An integer type for whole numbers from -2,147,483,648 to 2,147,483,647."),
        ["double"]=("Approximate number type","A number type that can hold fractions, with limited precision."),
        ["decimal"]=("Decimal number type","A number type suited to many exact base-ten fractions, with limited range and precision."),
        ["string"]=("Text type","The type used for text values."),["bool"]=("True-or-false type","The type with the two values true and false."),
        ["object"]=("Object type","The common base type for C# values. Here it can provide a shared lock object."),
        ["void"]=("No result value","This method does not return a result value."),
        ["true"]=("True","The Boolean value meaning this check is true."),["false"]=("False","The Boolean value meaning this check is false."),["null"]=("Missing value","No object value is present here."),
        ["if"]=("Check a condition","Runs the following statement or block when the condition is true."),["else"]=("Other branch","Runs when the matching if condition is false."),
        ["while"]=("Repeat while true","Checks the condition before each turn and repeats while it is true."),["for"]=("Counted loop","Combines a starting step, a condition, and an update around repeated work."),
        ["foreach"]=("Visit each value","Runs the body once for each value requested from this sequence."),
        ["break"]=("Leave the loop","Stops the enclosing loop here."),["continue"]=("Skip this turn","Skips the rest of this turn. A for loop still runs its update before checking again."),
        ["return"]=("Return result","Finishes this call and sends its result back to the caller."),
        ["new"]=("Create a value","Creates an instance of the type that follows, using the supplied starting values."),
        ["class"]=("Define a class","Starts a class definition describing a reference type."),["struct"]=("Define a struct","Starts a struct definition describing a value type."),
        ["record"]=("Define a record","Defines grouped data with generated value-based equality."),["enum"]=("Define choices","Defines named number values for a type."),["interface"]=("Define a contract","Lists members that implementing types agree to provide."),
        ["public"]=("Allow outside access","Allows this member or type to be accessed wherever its containing type is accessible."),["private"]=("Keep access inside","Limits access to the containing type."),
        ["static"]=("Belong to the type","For a member, uses the type rather than a particular object. A static local function cannot capture outside local variables."),
        ["abstract"]=("Require an implementation","For a method, declares it without a body. An abstract class cannot be created directly."),
        ["virtual"]=("Allow an override","Lets a derived class replace this method's default behavior."),["override"]=("Replace inherited behavior","Supplies this derived type's implementation of an inherited virtual or abstract member."),
        ["get"]=("Read a property","Provides the property's value when it is read."),["set"]=("Write a property","Handles an assignment to the property; value holds the incoming value."),
        ["ref"]=("Share the variable","Gives the called code access to the caller's variable. The caller must initialize it first."),["out"]=("Write an output","Lets the called code assign the caller's result variable. It must assign before returning normally."),
        ["where"]=("Type requirement","Starts a rule that the generic type argument must satisfy."),["with"]=("Copy with changes","Creates a copy with the specified changes, leaving the original record's properties alone."),
        ["switch"]=("Choose a result","Tests the following patterns in order and chooses the first matching result."),
        ["try"]=("Try this work","Starts work whose exceptions may be handled by the following catch blocks."),["catch"]=("Handle this error","Handles a matching exception from the try block."),["finally"]=("Final cleanup step","Runs when control leaves this try statement during normal program execution, on success or error."),["throw"]=("Signal an error","Interrupts normal steps by throwing the supplied exception."),
        ["checked"]=("Check the range","Reports overflow when this checked numeric operation produces a value outside the allowed range."),
        ["event"]=("Declare an event","Creates a notification that outside code can subscribe to while this type controls when it is raised."),
        ["yield"]=("Produce a sequence value","With return, offers the next iterator value when the consumer requests it."),
        ["async"]=("Allow await","Allows await in this method. It does not automatically start a new thread."),["await"]=("Wait for completion","Continues after the operation completes, using its result or reporting its error."),
        ["lock"]=("Take turns with this gate","Allows only one thread at a time into blocks protected by this same gate."),
        ["namespace"]=("Group type names","Starts a group of type names under this namespace."),
    };
    if(words.TryGetValue(text,out var word)) return D(word.Item1,word.Item2);
    if(text=="=") return p is EqualsValueClauseSyntax && p.Parent is ParameterSyntax?D("Default input","Supplies this value when the caller leaves out the optional argument."):D("Assign value","Stores the right-hand value in the variable, field, or property on the left.");
    if(text=="=>") return p is SwitchExpressionArmSyntax?D("Chosen result","The result after the arrow is used when this pattern matches."):D("Body or result","The expression or body after the arrow supplies this function's work or result.");
    if(text=="?" && p is NullableTypeSyntax) return D("May be missing","Marks a type that allows a missing value. For reference types, this guides compiler warnings.");
    if(text=="?" && p is ConditionalAccessExpressionSyntax) return D("Only if present","Accesses the following member only when the value is not null.");
    if(text=="??") return D("Missing-value backup","Uses the right value only when the left value is null.");
    if(text=="&&") return D("Both checks","Requires both checks to be true. If the left is false, the right is skipped.");
    if(text=="||") return D("Either check","Requires at least one check to be true. If the left is true, the right is skipped.");
    if(text=="!") return D("Reverse a check","Changes true to false and false to true.");
    if(text=="++") return D("Add one","Increases this value by one. It is not an indivisible shared update without protection.");
    if(text is "+=" or "-=")
    {
        var left=(p as AssignmentExpressionSyntax)?.Left;
        if(left!=null && model.GetSymbolInfo(left).Symbol is IEventSymbol) return text=="+="?D("Subscribe handler","Adds this handler to the event's subscriptions."):D("Unsubscribe handler","Removes the matching handler from the event's subscriptions.");
        return D(text=="+="?"Add and store":"Subtract and store","Combines the current left-hand value with the right-hand value and saves the result back on the left.");
    }
    if(text=="+") return D("Add or join","Adds numeric values, or joins text when this expression uses strings.");
    if(text=="-") return p is PrefixUnaryExpressionSyntax?D("Negative value","Gives this number a negative sign."):D("Subtract","Subtracts the right number from the left number.");
    if(text=="*") return D("Multiply","Multiplies the two numeric values.");
    if(text=="/") return D("Divide","Divides the left number by the right. Two integer operands give integer division, dropping the fractional part toward zero.");
    if(text=="%") return D("Remainder","Gives the amount left after division using the operands' numeric rules.");
    if(text=="==") return D("Equal?","Checks whether the values compare equal for their types. It does not assign a value.");
    if(text=="!=") return D("Different?","Checks whether the values compare unequal for their types.");
    if((text=="<"||text==">") && p is TypeArgumentListSyntax or TypeParameterListSyntax) return D("Generic type bracket",text=="<"?"Starts the list of type inputs or type placeholders.":"Ends the list of type inputs or type placeholders.");
    if(text is "<" or ">" or "<=" or ">=") return D("Compare values",text switch{"<"=>"Checks whether the left value is less than the right.",">"=>"Checks whether the left value is greater than the right.","<="=>"Checks whether the left value is at most the right.",_=>"Checks whether the left value is at least the right."});
    if(text==".") return D("Choose a member","Selects a named part, or joins parts of a namespace or type name.");
    if(text==",") return D("Next item","Separates inputs, values, or types in this list.");
    if(text==";") return p is ForStatementSyntax?D("Next loop part","Separates the loop's starting step, condition, and update."):D("End statement","Ends this statement or declaration.");
    if(text==":")
    {
        if(p is BaseListSyntax) return D("Build on a type","Names the base class or implemented interface that follows.");
        if(p is TypeParameterConstraintClauseSyntax) return D("Required type","Starts the requirements for this type parameter.");
        if(p is NameColonSyntax && Has<SubpatternSyntax>()) return D("Property to check","Connects the property name to the pattern that checks its value.");
        if(p is NameColonSyntax) return D("Named input value","Connects the input name to the supplied argument.");
    }
    if(text is "(" or ")")
    {
        string role=p switch {ArgumentListSyntax=>"call inputs",ParameterListSyntax=>"declared inputs",CastExpressionSyntax=>"conversion type",TupleExpressionSyntax or TupleTypeSyntax=>"tuple parts",_=>"grouped expression or condition"};
        return D(text=="("?"Open parentheses":"Close parentheses",(text=="("?"Starts ":"Ends ")+"the "+role+".");
    }
    if(text is "[" or "]")
    {
        string role=p is ArrayRankSpecifierSyntax?"array type":p is CollectionExpressionSyntax?"collection's starting values":"index inputs used to choose an element";
        return D(text=="["?"Open brackets":"Close brackets",(text=="["?"Starts ":"Ends ")+"the "+role+".");
    }
    if(text is "{" or "}")
    {
        string role=p switch {InitializerExpressionSyntax=>"starting or updated values",SwitchExpressionSyntax=>"switch choices",PropertyPatternClauseSyntax=>"property pattern",AccessorListSyntax=>"property accessors",_=>"block of instructions or definitions"};
        return D(text=="{"?"Open group":"Close group",(text=="{"?"Starts ":"Ends ")+"the "+role+".");
    }
    return D("Code","Read this source piece with its surrounding instruction.","gray");
}
static Description? Builtin(string owner,string name)
{
    string? text=(owner,name) switch {
        ("System.Console","WriteLine")=>"Displays the supplied value, then starts a new output line.",
        ("System.Console","ReadLine")=>"Reads one input line as text, or returns null when no input remains.",
        ("int","TryParse")=>"Tries to read whole-number text. Returns success or failure and writes the parsed result through out.",
        ("int","Parse")=>"Reads a whole number from text, or throws if the text cannot be read as an int.",
        ("string","ToUpperInvariant")=>"Returns uppercase text using fixed language-independent casing rules. It does not replace the original string.",
        ("string","IsNullOrWhiteSpace")=>"Checks whether text is missing, empty, or contains only whitespace.",
        ("string","Trim")=>"Returns text without whitespace at its beginning and end.",
        ("string","Join")=>"Reads the values and joins their text with the supplied separator.",
        ("System.Linq.Enumerable","Where")=>"Keeps values whose supplied test returns true when the query is read.",
        ("System.Linq.Enumerable","Select")=>"Uses the supplied function to transform each value when the query is read.",
        ("System.Linq.Enumerable","ToList")=>"Reads this sequence now and stores its values in a new list.",
        ("System.Linq.Enumerable","ToArray")=>"Reads this sequence now and stores its values in a new array.",
        ("System.Linq.Enumerable","GroupBy")=>"Groups values that have the same key produced by the supplied function.",
        ("System.Linq.Enumerable","OrderBy")=>"Orders the results by the supplied key, from smallest to largest by default.",
        ("System.Linq.Enumerable","Count")=>"Counts the values in this sequence.",
        ("System.Linq.Enumerable","Range")=>"Produces consecutive whole numbers from the starting value for the supplied count.",
        ("System.Threading.Tasks.Task","Delay")=>"Returns a task for a requested delay in milliseconds. Completion timing is not exact.",
        ("System.Threading.Tasks.Task","WhenAll")=>"Waits for all supplied tasks. Successful results keep the supplied task order.",
        ("System.Threading.Tasks.Task","Run")=>"Queues the supplied work on the thread pool and returns a task for it.",
        ("System.Threading.CancellationTokenSource","Cancel")=>"Requests cancellation. Work must cooperate by checking its token.",
        ("System.Threading.CancellationToken","ThrowIfCancellationRequested")=>"Throws a cancellation exception if this token has a stop request.",
        ("System.IO.Path","GetTempFileName")=>"Creates a temporary file and returns its path.",
        ("System.IO.File","WriteAllText")=>"Writes all supplied text, replacing existing contents, then closes the file.",
        ("System.IO.File","ReadAllText")=>"Reads the file's contents into one string and closes the file.",
        ("System.IO.File","Delete")=>"Deletes the file at the supplied path. File operations can fail.",
        ("System.Text.Json.JsonSerializer","Serialize")=>"Turns the supplied value into JSON text.",
        ("System.Text.Json.JsonSerializer","Deserialize")=>"Tries to build the chosen type from JSON text. Application rules still need separate checks.",
        ("System.Math","Max")=>"Returns the larger of the two values.",
        ("System.MemoryExtensions","AsSpan")=>"Creates a view over the selected array elements without copying them.",
        _=>null
    };
    return text==null?null:D("Call "+name,text,"blue");
}
record Description(string Label,string Text,string Tone);
record Example(string id,string source,object[][] parts);
