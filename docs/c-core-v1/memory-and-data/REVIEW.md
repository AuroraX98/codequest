# C25–42 memory and data

18 staged concept lessons, following the supplied coverage plan. No live app or repository publication edits.

## Evidence
- `python author.py` regenerates lessons, exact paragraph support, navigation headings, terminology and 36 standalone companions.
- `python validate.py` checks all 18 structural/support mappings and compiles all 36 examples with actual GCC 14.2.0, `-std=c17 -Wall -Wextra -Wpedantic -Werror`.
- `compiler-validation.json`: 36/36 pass; 35 successful executions with exact expected stdout and one intended compile rejection for modifying through a pointer-to-const. No intentionally undefined behavior is executed.
- Each case uses a fresh temporary directory and executable. Source hashes are stored in the compiler report. Allocation examples tested successful allocation; deterministic allocator failure injection is not claimed.
- Optional transfer tasks remain visible prose; completion in the app is not proof of local compiler execution or mastery.

## Primary references
- WG14 N1570 committee draft: https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf
  - 6.2.4 storage duration; 6.5.6 pointer arithmetic; 6.7.3 qualification; 6.7.2 structures/unions/enums; 6.7.8 typedef; 6.5.2.5 compound literals.
  - 7.22.3 allocation and deallocation; 7.22.5.2 qsort.
- GCC14.2 dialect documentation: https://gcc.gnu.org/onlinedocs/gcc-14.2.0/gcc/C-Dialect-Options.html
  Explains C17 defect-correction relationship to C11. N1570 is a C11 draft reference for unchanged core rules, not falsely labelled the published C17 standard. C23 support in this compiler is incomplete/experimental; these lessons do not claim C23 completeness.

## Safety scope
All dereferences are within live objects/allocations. One-past and dangling pointers are discussed, not dereferenced. No stale pointer is compared after realloc/free. Ownership remains a manual C convention, never described as RAII. realloc is positive-sized with temporary-pointer failure handling. calloc's all-bits-zero promise is not generalized to pointer or floating representations. Allocation-size multiplication is checked before use. Comparator returns relational signs rather than potentially overflowing subtraction. The dynamic vector is explicitly bounded to two slots, not a production generic container. Node cleanup saves next before free.
