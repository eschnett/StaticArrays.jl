var documenterSearchIndex = {"docs":
[{"location":"#Static-Arrays-1","page":"Home","title":"Static Arrays","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Statically sized arrays for Julia","category":"page"},{"location":"#","page":"Home","title":"Home","text":"StaticArrays provides a framework for implementing statically sized arrays in Julia (≥ 0.5), using the abstract type StaticArray{Size,T,N} <: AbstractArray{T,N}. Subtypes of StaticArray will provide fast implementations of common array and linear algebra operations. Note that here \"statically sized\" means that the size can be determined from the type, and \"static\" does not necessarily imply immutable.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The package also provides some concrete static array types: SVector, SMatrix and SArray, which may be used as-is (or else embedded in your own type). Mutable versions MVector, MMatrix and MArray are also exported, as well as SizedArray for annotating standard Arrays with static size information. Further, the abstract FieldVector can be used to make fast static vectors out of any uniform Julia \"struct\".","category":"page"},{"location":"#Migrating-code-from-Julia-v0.6-to-Julia-v0.7-1","page":"Home","title":"Migrating code from Julia v0.6 to Julia v0.7","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"When upgrading code that is depending on StaticArrays the following notes may be helpful","category":"page"},{"location":"#","page":"Home","title":"Home","text":"chol has been renamed to cholesky and return a factorization object. To obtain the factor use C = cholesky(A).U, just like for regular Julia arrays.\nlu now return a factorization object instead of a tuple with L, U, and p. They can be obtained by destructing via iteration (L, U, p = lu(A)) or by using getfield (F = lu(A); L, U, p = F.L, F.U, F.p).\nqr now return a factorization object instead of a tuple with Q and R. They can be obtained by destructing via iteration (Q, R = qr(A)) or by using getfield (F = qr(A); Q, R = F.Q, F.R)\neig has been renamed to eigen, which return a factorization object, rather than a tuple with (values, vectors). They can be obtained by destructing via iteration (values, vectors = eigen(A)) or by using getfield (E = eigen(A); values, vectors = E.values, E.vectors).\nunshift and shift have been renamed to pushfirst and popfirst.","category":"page"},{"location":"pages/api/#API-1","page":"API","title":"API","text":"","category":"section"},{"location":"pages/api/#Guide-1","page":"API","title":"Guide","text":"","category":"section"},{"location":"pages/api/#SVector-1","page":"API","title":"SVector","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"The simplest static array is the type SVector{N,T}, which provides an immutable vector of fixed length N and type T.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"SVector defines a series of convenience constructors, so you can just type e.g. SVector(1,2,3). Alternatively there is an intelligent @SVector macro where you can use native Julia array literals syntax, comprehensions, and the zeros(), ones(), fill(), rand() and randn() functions, such as @SVector [1,2,3], @SVector Float64[1,2,3], @SVector [f(i) for i = 1:10], @SVector zeros(3), @SVector randn(Float32, 4), etc (Note: the range of a comprehension is evaluated at global scope by the macro, and must be made of combinations of literal values, functions, or global variables, but is not limited to just simple ranges. Extending this to (hopefully statically known by type-inference) local-scope variables is hoped for the future. The zeros(), ones(), fill(), rand() and randn() functions do not have this limitation.)","category":"page"},{"location":"pages/api/#SMatrix-1","page":"API","title":"SMatrix","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Statically sized N×M matrices are provided by SMatrix{N,M,T,L}.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Here L is the length of the matrix, such that N × M = L. However, convenience constructors are provided, so that L, T and even M are unnecessary. At minimum, you can type SMatrix{2}(1,2,3,4) to create a 2×2 matrix (the total number of elements must divide evenly into N). A convenience macro @SMatrix [1 2; 3 4] is provided (which also accepts comprehensions and the zeros(), ones(), fill(), rand(), randn() and eye() functions).","category":"page"},{"location":"pages/api/#SArray-1","page":"API","title":"SArray","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"A container with arbitrarily many dimensions is defined as struct SArray{Size,T,N,L} <: StaticArray{Size,T,N}, where Size = Tuple{S1, S2, ...} is a tuple of Ints. You can easily construct one with the @SArray macro, supporting all the features of @SVector and @SMatrix (but with arbitrary dimension).","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"The main reason SVector and SMatrix are defined is to make it easier to define the types without the extra tuple characters (compare SVector{3} to SArray{Tuple{3}}).","category":"page"},{"location":"pages/api/#Scalar-1","page":"API","title":"Scalar","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Sometimes you want to broadcast an operation, but not over one of your inputs. A classic example is attempting to displace a collection of vectors by the same vector. We can now do this with the Scalar type:","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"[[1,2,3], [4,5,6]] .+ Scalar([1,0,-1]) # [[2,2,2], [5,5,5]]","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Scalar is simply an implementation of an immutable, 0-dimensional StaticArray.","category":"page"},{"location":"pages/api/#The-Size-trait-1","page":"API","title":"The Size trait","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"The size of a statically sized array is a static parameter associated with the type of the array. The Size trait is provided as an abstract representation of the dimensions of a static array. An array sa::SA of size (dims...) is associated with Size{(dims...)}(). The following are equivalent (@pure) constructors:","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Size{(dims...,)}()\nSize(dims...)\nSize(sa::StaticArray)\nSize(SA) # SA <: StaticArray","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"This is extremely useful for (a) performing dispatch depending on the size of an array, and (b) passing array dimensions that the compiler can reason about.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"An example of size-based dispatch for the determinant of a matrix would be:","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"det(x::StaticMatrix) = _det(Size(x), x)\n_det(::Size{(1,1)}, x::StaticMatrix) = x[1,1]\n_det(::Size{(2,2)}, x::StaticMatrix) = x[1,1]*x[2,2] - x[1,2]*x[2,1]\n# and other definitions as necessary","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Examples of using Size as a compile-time constant include","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"reshape(svector, Size(2,2))  # Convert SVector{4} to SMatrix{2,2}\nSize(3,3)(rand(3,3))         # Construct a random 3×3 SizedArray (see below)","category":"page"},{"location":"pages/api/#Indexing-1","page":"API","title":"Indexing","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Statically sized indexing can be realized by indexing each dimension by a scalar, a StaticVector or :. Indexing in this way will result a statically sized array (even if the input was dynamically sized, in the case of StaticVector indices) of the closest type (as defined by similar_type).","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Conversely, indexing a statically sized array with a dynamically sized index (such as a Vector{Integer} or UnitRange{Integer}) will result in a standard (dynamically sized) Array.","category":"page"},{"location":"pages/api/#similar_type()-1","page":"API","title":"similar_type()","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Since immutable arrays need to be constructed \"all-at-once\", we need a way of obtaining an appropriate constructor if the element type or dimensions of the output array differs from the input. To this end, similar_type is introduced, behaving just like similar, except that it returns a type. Relevant methods are:","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"similar_type(::Type{A}) where {A <: StaticArray} # defaults to A\nsimilar_type(::Type{A}, ::Type{ElType}) where {A <: StaticArray, ElType} # Change element type\nsimilar_type(::Type{A}, size::Size) where {A <: AbstractArray} # Change size\nsimilar_type(::Type{A}, ::Type{ElType}, size::Size) where {A <: AbstractArray, ElType} # Change both","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"These setting will affect everything, from indexing, to matrix multiplication and broadcast. Users wanting introduce a new array type should only overload the last method in the above.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Use of similar will fall back to a mutable container, such as a MVector (see below), and it requires use of the Size trait if you wish to set a new static size (or else a dynamically sized Array will be generated when specifying the size as plain integers).","category":"page"},{"location":"pages/api/#Mutable-arrays:-MVector,-MMatrix-and-MArray-1","page":"API","title":"Mutable arrays: MVector, MMatrix and MArray","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"These statically sized arrays are identical to the above, but are defined as mutable structs, instead of immutable structs. Because they are mutable, they allow setindex! to be defined (achieved through pointer manipulation, into a tuple).","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"As a consequence of Julia's internal implementation, these mutable containers live on the heap, not the stack. Their memory must be allocated and tracked by the garbage collector. Nevertheless, there is opportunity for speed improvements relative to Base.Array because (a) there may be one less pointer indirection, (b) their (typically small) static size allows for additional loop unrolling and inlining, and consequentially (c) their mutating methods like map! are extremely fast. Benchmarking shows that operations such as addition and matrix multiplication are faster for MMatrix than Matrix, at least for sizes up to 14 × 14, though keep in mind that optimal speed will be obtained by using mutating functions (like map! or A_mul_B!) where possible, rather than reallocating new memory.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Mutable static arrays also happen to be very useful containers that can be constructed on the heap (with the ability to use setindex!, etc), and later copied as e.g. an immutable SVector to the stack for use, or into e.g. an Array{SVector} for storage.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Convenience macros @MVector, @MMatrix and @MArray are provided.","category":"page"},{"location":"pages/api/#SizedArray:-a-decorate-size-wrapper-for-Array-1","page":"API","title":"SizedArray: a decorate size wrapper for Array","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Another convenient mutable type is the SizedArray, which is just a wrapper-type about a standard Julia Array which declares its knwon size. For example, if we knew that a was a 2×2 Matrix, then we can type sa = SizedArray{Tuple{2,2}}(a) to construct a new object which knows the type (the size will be verified automatically). A more convenient syntax for obtaining a SizedArray is by calling a Size object, e.g. sa = Size(2,2)(a).","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Then, methods on sa will use the specialized code provided by the StaticArrays pacakge, which in many cases will be much, much faster. For example, calling eig(sa) will be signficantly faster than eig(a) since it will perform a specialized 2×2 matrix diagonalization rather than a general algorithm provided by Julia and LAPACK.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"In some cases it will make more sense to use a SizedArray, and in other cases an MArray might be preferable.","category":"page"},{"location":"pages/api/#FieldVector-1","page":"API","title":"FieldVector","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Sometimes it might be useful to imbue your own types, having multiple fields, with vector-like properties. StaticArrays can take care of this for you by allowing you to inherit from FieldVector{N, T}. For example, consider:","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"struct Point3D <: FieldVector{3, Float64}\n    x::Float64\n    y::Float64\n    z::Float64\nend","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"With this type, users can easily access fields to p = Point3D(x,y,z) using p.x, p.y or p.z, or alternatively via p[1], p[2], or p[3]. You may even permute the coordinates with p[SVector(3,2,1)]). Furthermore, Point3D is a complete AbstractVector implementation where you can add, subtract or scale vectors, multiply them by matrices, etc.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"It is also worth noting that FieldVectors may be mutable or immutable, and that setindex! is defined for use on mutable types. For immutable containers, you may want to define a method for similar_type so that operations leave the type constant (otherwise they may fall back to SVector). For mutable containers, you may want to define a default constructor (no inputs) and an appropriate method for similar,","category":"page"},{"location":"pages/api/#Implementing-your-own-types-1","page":"API","title":"Implementing your own types","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"You can easily create your own StaticArray type, by defining linear getindex (and optionally setindex! for mutable types - see setindex(::MArray, val, i) in MArray.jl for an example of how to achieve this through pointer manipulation). Your type should define a constructor that takes a tuple of the data (and mutable containers may want to define a default constructor).","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Other useful functions to overload may be similar_type (and similar for mutable containers).","category":"page"},{"location":"pages/api/#Conversions-from-Array-1","page":"API","title":"Conversions from Array","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"In order to convert from a dynamically sized AbstractArray to one of the statically sized array types, you must specify the size explicitly.  For example,","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"v = [1,2]\n\nm = [1 2;\n     3 4]\n\n# ... a lot of intervening code\n\nsv = SVector{2}(v)\nsm = SMatrix{2,2}(m)\nsa = SArray{(2,2)}(m)\n\nsized_v = Size(2)(v)     # SizedArray{(2,)}(v)\nsized_m = Size(2,2)(m)   # SizedArray{(2,2)}(m)","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"We have avoided adding SVector(v::AbstractVector) as a valid constructor to help users avoid the type instability (and potential performance disaster, if used without care) of this innocuous looking expression. However, the simplest way to deal with an Array is to create a SizedArray by calling a Size instance, e.g. Size(2)(v).","category":"page"},{"location":"pages/api/#Arrays-of-static-arrays-1","page":"API","title":"Arrays of static arrays","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Storing a large number of static arrays is convenient as an array of static arrays. For example, a collection of positions (3D coordinates - SVector{3,Float64}) could be represented as a Vector{SVector{3,Float64}}.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Another common way of storing the same data is as a 3×N Matrix{Float64}. Rather conveniently, such types have exactly the same binary layout in memory, and therefore we can use reinterpret to convert between the two formats","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"function svectors(x::Matrix{T}, ::Val{N}) where {T,N}\n    size(x,1) == N || error(\"sizes mismatch\")\n    isbitstype(T) || error(\"use for bitstypes only\")\n    reinterpret(SVector{N,T}, vec(x))\nend","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Such a conversion does not copy the data, rather it refers to the same memory. Arguably, a Vector of SVectors is often preferable to a Matrix because it provides a better abstraction of the objects contained in the array and it allows the fast StaticArrays methods to act on elements.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"However, the resulting object is a Base.ReinterpretArray, not an Array, which carries some runtime penalty on every single access. If you can afford the memory for a copy and can live with the non-shared mutation semantics, then it is better to pull a copy by e.g.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"function svectorscopy(x::Matrix{T}, ::Val{N}) where {T,N}\n    size(x,1) == N || error(\"sizes mismatch\")\n    isbitstype(T) || error(\"use for bitstypes only\")\n    copy(reinterpret(SVector{N,T}, vec(x)))\nend","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"For example:","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"julia> M=reshape(collect(1:6), (2,3))\n2×3 Array{Int64,2}:\n 1  3  5\n 2  4  6\n\njulia> svectors(M, Val{2}())\n3-element reinterpret(SArray{Tuple{2},Int64,1,2}, ::Array{Int64,1}):\n [1, 2]\n [3, 4]\n [5, 6]\n\njulia> svectorscopy(M, Val{2}())\n3-element Array{SArray{Tuple{2},Int64,1,2},1}:\n [1, 2]\n [3, 4]\n [5, 6]","category":"page"},{"location":"pages/api/#Working-with-mutable-and-immutable-arrays-1","page":"API","title":"Working with mutable and immutable arrays","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Generally, it is performant to rebind an immutable array, such as","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"function average_position(positions::Vector{SVector{3,Float64}})\n    x = zeros(SVector{3,Float64})\n    for pos ∈ positions\n        x = x + pos\n    end\n    return x / length(positions)\nend","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"so long as the Type of the rebound variable (x, above) does not change.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"On the other hand, the above code for mutable containers like Array, MArray or SizedArray is not very efficient. Mutable containers in Julia 0.5 must be allocated and later garbage collected, and for small, fixed-size arrays this can be a leading contribution to the cost. In the above code, a new array will be instantiated and allocated on each iteration of the loop. In order to avoid unnecessary allocations, it is best to allocate an array only once and apply mutating functions to it:","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"function average_position(positions::Vector{SVector{3,Float64}})\n    x = zeros(MVector{3,Float64})\n    for pos ∈ positions\n        # Take advantage of Julia 0.5 broadcast fusion\n        x .= (+).(x, pos) # same as broadcast!(+, x, x, positions[i])\n    end\n    x .= (/).(x, length(positions))\n    return x\nend","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Keep in mind that Julia 0.5 does not fuse calls to .+, etc (or .+= etc), however the .= and (+).() syntaxes are fused into a single, efficient call to broadcast!. The simpler syntax x .+= pos is expected to be non-allocating (and therefore faster) in Julia 0.6.","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"The functions setindex, push, pop, shift, unshift, insert and deleteat are provided for performing certain specific operations on static arrays, in analogy with the standard functions setindex!, push!, pop!, etc. (Note that if the size of the static array changes, the type of the output will differ from the input.)","category":"page"},{"location":"pages/api/#SIMD-optimizations-1","page":"API","title":"SIMD optimizations","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"It seems Julia and LLVM are smart enough to use processor vectorization extensions like SSE and AVX - however they are currently partially disabled by default. Run Julia with julia -O or julia -O3 to enable these optimizations, and many of your (immutable) StaticArray methods should become significantly faster!","category":"page"},{"location":"pages/api/#Docstrings-1","page":"API","title":"Docstrings","text":"","category":"section"},{"location":"pages/api/#","page":"API","title":"API","text":"Pages   = [\"api.md\"]","category":"page"},{"location":"pages/api/#","page":"API","title":"API","text":"Modules = [StaticArrays]","category":"page"},{"location":"pages/api/#StaticArrays.FieldVector","page":"API","title":"StaticArrays.FieldVector","text":"abstract FieldVector{N, T} <: StaticVector{N, T}\n\nInheriting from this type will make it easy to create your own vector types. A FieldVector will automatically define getindex and setindex! appropriately. An immutable FieldVector will be as performant as an SVector of similar length and element type, while a mutable FieldVector will behave similarly to an MVector.\n\nFor example:\n\nstruct Point3D <: FieldVector{3, Float64}\n    x::Float64\n    y::Float64\n    z::Float64\nend\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.MArray","page":"API","title":"StaticArrays.MArray","text":"MArray{S, T, L}()\nMArray{S, T, L}(x::NTuple{L, T})\nMArray{S, T, L}(x1, x2, x3, ...)\n\nConstruct a statically-sized, mutable array MArray. The data may optionally be provided upon construction and can be mutated later. The S parameter is a Tuple-type specifying the dimensions, or size, of the array - such as Tuple{3,4,5} for a 3×4×5-sized array. The L parameter is the length of the array and is always equal to prod(S). Constructors may drop the L and T parameters if they are inferrable from the input (e.g. L is always inferrable from S).\n\nMArray{S}(a::Array)\n\nConstruct a statically-sized, mutable array of dimensions S (expressed as a Tuple{...}) using the data from a. The S parameter is mandatory since the size of a is unknown to the compiler (the element type may optionally also be specified).\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.MMatrix","page":"API","title":"StaticArrays.MMatrix","text":"MMatrix{S1, S2, T, L}()\nMMatrix{S1, S2, T, L}(x::NTuple{L, T})\nMMatrix{S1, S2, T, L}(x1, x2, x3, ...)\n\nConstruct a statically-sized, mutable matrix MMatrix. The data may optionally be provided upon construction and can be mutated later. The L parameter is the length of the array and is always equal to S1 * S2. Constructors may drop the L, T and even S2 parameters if they are inferrable from the input (e.g. L is always inferrable from S1 and S2).\n\nMMatrix{S1, S2}(mat::Matrix)\n\nConstruct a statically-sized, mutable matrix of dimensions S1 × S2 using the data from mat. The parameters S1 and S2 are mandatory since the size of mat is unknown to the compiler (the element type may optionally also be specified).\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.MVector","page":"API","title":"StaticArrays.MVector","text":"MVector{S,T}()\nMVector{S,T}(x::NTuple{S, T})\nMVector{S,T}(x1, x2, x3, ...)\n\nConstruct a statically-sized, mutable vector MVector. Data may optionally be provided upon construction, and can be mutated later. Constructors may drop the T and S parameters if they are inferrable from the input (e.g. MVector(1,2,3) constructs an MVector{3, Int}).\n\nMVector{S}(vec::Vector)\n\nConstruct a statically-sized, mutable vector of length S using the data from vec. The parameter S is mandatory since the length of vec is unknown to the compiler (the element type may optionally also be specified).\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.SArray","page":"API","title":"StaticArrays.SArray","text":"SArray{S, T, L}(x::NTuple{L, T})\nSArray{S, T, L}(x1, x2, x3, ...)\n\nConstruct a statically-sized array SArray. Since this type is immutable, the data must be provided upon construction and cannot be mutated later. The S parameter is a Tuple-type specifying the dimensions, or size, of the array - such as Tuple{3,4,5} for a 3×4×5-sized array. The L parameter is the length of the array and is always equal to prod(S). Constructors may drop the L and T parameters if they are inferrable from the input (e.g. L is always inferrable from S).\n\nSArray{S}(a::Array)\n\nConstruct a statically-sized array of dimensions S (expressed as a Tuple{...}) using the data from a. The S parameter is mandatory since the size of a is unknown to the compiler (the element type may optionally also be specified).\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.SHermitianCompact","page":"API","title":"StaticArrays.SHermitianCompact","text":"SHermitianCompact{N, T, L} <: StaticMatrix{N, N, T}\n\nA StaticArray subtype that represents a Hermitian matrix. Unlike LinearAlgebra.Hermitian, SHermitianCompact stores only the lower triangle of the matrix (as an SVector). The lower triangle is stored in column-major order. For example, for an SHermitianCompact{3}, the indices of the stored elements can be visualized as follows:\n\n┌ 1 ⋅ ⋅ ┐\n| 2 4 ⋅ |\n└ 3 5 6 ┘\n\nType parameters:\n\nN: matrix dimension;\nT: element type for lower triangle;\nL: length of the SVector storing the lower triangular elements.\n\nNote that L is always the Nth triangular number.\n\nAn SHermitianCompact may be constructed either:\n\nfrom an AbstractVector containing the lower triangular elements; or\nfrom a Tuple containing both upper and lower triangular elements in column major order; or\nfrom another StaticMatrix.\n\nFor the latter two cases, only the lower triangular elements are used; the upper triangular elements are ignored.\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.SMatrix","page":"API","title":"StaticArrays.SMatrix","text":"SMatrix{S1, S2, T, L}(x::NTuple{L, T})\nSMatrix{S1, S2, T, L}(x1, x2, x3, ...)\n\nConstruct a statically-sized matrix SMatrix. Since this type is immutable, the data must be provided upon construction and cannot be mutated later. The L parameter is the length of the array and is always equal to S1 * S2. Constructors may drop the L, T and even S2 parameters if they are inferrable from the input (e.g. L is always inferrable from S1 and S2).\n\nSMatrix{S1, S2}(mat::Matrix)\n\nConstruct a statically-sized matrix of dimensions S1 × S2 using the data from mat. The parameters S1 and S2 are mandatory since the size of mat is unknown to the compiler (the element type may optionally also be specified).\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.SOneTo","page":"API","title":"StaticArrays.SOneTo","text":"SOneTo(n)\n\nReturn a statically-sized AbstractUnitRange starting at 1, functioning as the axes of a StaticArray.\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.SVector","page":"API","title":"StaticArrays.SVector","text":"SVector{S, T}(x::NTuple{S, T})\nSVector{S, T}(x1, x2, x3, ...)\n\nConstruct a statically-sized vector SVector. Since this type is immutable, the data must be provided upon construction and cannot be mutated later. Constructors may drop the T and S parameters if they are inferrable from the input (e.g. SVector(1,2,3) constructs an SVector{3, Int}).\n\nSVector{S}(vec::Vector)\n\nConstruct a statically-sized vector of length S using the data from vec. The parameter S is mandatory since the length of vec is unknown to the compiler (the element type may optionally also be specified).\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.Scalar","page":"API","title":"StaticArrays.Scalar","text":"Scalar{T}(x::T)\n\nConstruct a statically-sized 0-dimensional array that contains a single element, x. This type is particularly useful for influencing broadcasting operations.\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.Size","page":"API","title":"StaticArrays.Size","text":"Size(dims::Int...)\n\nSize is used extensively throughout the StaticArrays API to describe compile-time knowledge of the size of an array. The dimensions are stored as a type parameter and are statically propagated by the compiler, resulting in efficient, type-inferrable code. For example, to create a static matrix of zeros, use zeros(Size(3,3)) (rather than zeros(3,3), which constructs a Base.Array).\n\nNote that if dimensions are not known statically (e.g., for standard Arrays), Dynamic() should be used instead of an Int.\n\nSize(a::AbstractArray)\nSize(::Type{T<:AbstractArray})\n\nThe Size constructor can be used to extract static dimension information from a given array. For example:\n\njulia> Size(zeros(SMatrix{3, 4}))\nSize(3, 4)\n\njulia> Size(zeros(3, 4))\nSize(StaticArrays.Dynamic(), StaticArrays.Dynamic())\n\nThis has multiple uses, including \"trait\"-based dispatch on the size of a statically-sized array. For example:\n\ndet(x::StaticMatrix) = _det(Size(x), x)\n_det(::Size{(1,1)}, x::StaticMatrix) = x[1,1]\n_det(::Size{(2,2)}, x::StaticMatrix) = x[1,1]*x[2,2] - x[1,2]*x[2,1]\n# and other definitions as necessary\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.Size-Union{Tuple{Array}, Tuple{S}} where S","page":"API","title":"StaticArrays.Size","text":"Size(dims)(array)\n\nCreates a SizedArray wrapping array with the specified statically-known dims, so to take advantage of the (faster) methods defined by the static array package.\n\n\n\n\n\n","category":"method"},{"location":"pages/api/#StaticArrays.SizedArray","page":"API","title":"StaticArrays.SizedArray","text":"SizedArray{Tuple{dims...}}(array)\n\nWraps an Array with a static size, so to take advantage of the (faster) methods defined by the static array package. The size is checked once upon construction to determine if the number of elements (length) match, but the array may be reshaped.\n\n(Also, Size(dims...)(array) acheives the same thing)\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.StaticArray","page":"API","title":"StaticArrays.StaticArray","text":"abstract type StaticArray{S, T, N} <: AbstractArray{T, N} end\nStaticScalar{T}     = StaticArray{Tuple{}, T, 0}\nStaticVector{N,T}   = StaticArray{Tuple{N}, T, 1}\nStaticMatrix{N,M,T} = StaticArray{Tuple{N,M}, T, 2}\n\nStaticArrays are Julia arrays with fixed, known size.\n\nDev docs\n\nThey must define the following methods:\n\nConstructors that accept a flat tuple of data.\ngetindex() with an integer (linear indexing) (preferably @inline with @boundscheck).\nTuple(), returning the data in a flat Tuple.\n\nIt may be useful to implement:\n\nsimilar_type(::Type{MyStaticArray}, ::Type{NewElType}, ::Size{NewSize}), returning a type (or type constructor) that accepts a flat tuple of data.\n\nFor mutable containers you may also need to define the following:\n\nsetindex! for a single element (linear indexing).\nsimilar(::Type{MyStaticArray}, ::Type{NewElType}, ::Size{NewSize}).\nIn some cases, a zero-parameter constructor, MyStaticArray{...}() for unintialized data is assumed to exist.\n\n(see also SVector, SMatrix, SArray, MVector, MMatrix, MArray, SizedArray and FieldVector)\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#StaticArrays.similar_type","page":"API","title":"StaticArrays.similar_type","text":"similar_type(static_array)\nsimilar_type(static_array, T)\nsimilar_type(array, ::Size)\nsimilar_type(array, T, ::Size)\n\nReturns a constructor for a statically-sized array similar to the input array (or type) static_array/array, optionally with different element type T or size Size. If the input array is not a StaticArray then the Size is mandatory.\n\nThis differs from similar() in that the resulting array type may not be mutable (or define setindex!()), and therefore the returned type may need to be constructed with its data.\n\nNote that the (optional) size must be specified as a static Size object (so the compiler can infer the result statically).\n\nNew types should define the signature similar_type(::Type{A},::Type{T},::Size{S}) where {A<:MyType,T,S} if they wish to overload the default behavior.\n\n\n\n\n\n","category":"function"},{"location":"pages/api/#StaticArrays.Dynamic","page":"API","title":"StaticArrays.Dynamic","text":"Dynamic()\n\nUsed to signify that a dimension of an array is not known statically.\n\n\n\n\n\n","category":"type"},{"location":"pages/api/#Base.similar-Union{Tuple{SA}, Tuple{SA}} where SA<:StaticArray","page":"API","title":"Base.similar","text":"similar(static_array)\nsimilar(static_array, T)\nsimilar(array, ::Size)\nsimilar(array, T, ::Size)\n\nConstructs and returns a mutable but statically-sized array (i.e. a StaticArray). If the input array is not a StaticArray, then the Size is required to determine the output size (or else a dynamically sized array will be returned).\n\n\n\n\n\n","category":"method"},{"location":"pages/api/#LinearAlgebra.qr","page":"API","title":"LinearAlgebra.qr","text":"qr(A::StaticMatrix, pivot=Val(false))\n\nCompute the QR factorization of A. The factors can be obtain by iteration:\n\njulia> A = @SMatrix rand(3,4);\n\njulia> Q, R = qr(A);\n\njulia> Q * R ≈ A\ntrue\n\nor by using getfield:\n\njulia> F = qr(A);\n\njulia> F.Q * F.R ≈ A\ntrue\n\n\n\n\n\n","category":"function"},{"location":"pages/api/#StaticArrays._size-Tuple{Any}","page":"API","title":"StaticArrays._size","text":"Return either the statically known Size() or runtime size()\n\n\n\n\n\n","category":"method"},{"location":"pages/api/#StaticArrays.arithmetic_closure-Union{Tuple{Type{T}}, Tuple{T}} where T","page":"API","title":"StaticArrays.arithmetic_closure","text":"arithmetic_closure(T)\n\nReturn the type which values of type T will promote to under a combination of the arithmetic operations +, -, * and /.\n\njulia> import StaticArrays.arithmetic_closure\n\njulia> arithmetic_closure(Bool)\nFloat64\n\njulia> arithmetic_closure(Int32)\nFloat64\n\njulia> arithmetic_closure(BigFloat)\nBigFloat\n\njulia> arithmetic_closure(BigInt)\nBigFloat\n\n\n\n\n\n","category":"method"},{"location":"pages/api/#StaticArrays.dimmatch","page":"API","title":"StaticArrays.dimmatch","text":"dimmatch(x::StaticDimension, y::StaticDimension)\n\nReturn whether dimensions x and y match at compile time, that is:\n\nif x and y are both Ints, check that they are equal\nif x or y are Dynamic(), return true\n\n\n\n\n\n","category":"function"},{"location":"pages/api/#StaticArrays.same_size-Tuple","page":"API","title":"StaticArrays.same_size","text":"Returns the common Size of the inputs (or else throws a DimensionMismatch)\n\n\n\n\n\n","category":"method"},{"location":"pages/api/#StaticArrays.sizematch-Union{Tuple{S2}, Tuple{S1}, Tuple{Size{S1},Size{S2}}} where S2 where S1","page":"API","title":"StaticArrays.sizematch","text":"sizematch(::Size, ::Size)\nsizematch(::Tuple, ::Tuple)\n\nDetermine whether two sizes match, in the sense that they have the same number of dimensions, and their dimensions match as determined by dimmatch.\n\n\n\n\n\n","category":"method"},{"location":"pages/api/#StaticArrays.sizematch-Union{Tuple{S}, Tuple{Size{S},StaticArray}} where S","page":"API","title":"StaticArrays.sizematch","text":"sizematch(::Size, A::AbstractArray)\n\nDetermine whether array A matches the given size. If A is a StaticArray, the check is performed at compile time, otherwise, the check is performed at runtime.\n\n\n\n\n\n","category":"method"},{"location":"pages/quickstart/#Quick-Start-1","page":"Quick Start","title":"Quick Start","text":"","category":"section"},{"location":"pages/quickstart/#","page":"Quick Start","title":"Quick Start","text":"Pkg.add(\"StaticArrays\")  # or Pkg.clone(\"https://github.com/JuliaArrays/StaticArrays.jl\")\nusing StaticArrays\nusing LinearAlgebra\n\n# Create an SVector using various forms, using constructors, functions or macros\nv1 = SVector(1, 2, 3)\nv1.data === (1, 2, 3) # SVector uses a tuple for internal storage\nv2 = SVector{3,Float64}(1, 2, 3) # length 3, eltype Float64\nv3 = @SVector [1, 2, 3]\nv4 = @SVector [i^2 for i = 1:10] # arbitrary comprehensions (range is evaluated at global scope)\nv5 = zeros(SVector{3}) # defaults to Float64\nv6 = @SVector zeros(3)\nv7 = SVector{3}([1, 2, 3]) # Array conversions must specify size\n\n# Can get size() from instance or type\nsize(v1) == (3,)\nsize(typeof(v1)) == (3,)\n\n# Similar constructor syntax for matrices\nm1 = SMatrix{2,2}(1, 2, 3, 4) # flat, column-major storage, equal to m2:\nm2 = @SMatrix [ 1  3 ;\n                2  4 ]\nm3 = SMatrix{3,3}(1I)\nm4 = @SMatrix randn(4,4)\nm5 = SMatrix{2,2}([1 3 ; 2 4]) # Array conversions must specify size\n\n# Higher-dimensional support\na = @SArray randn(2, 2, 2, 2, 2, 2)\n\n# Supports all the common operations of AbstractArray\nv7 = v1 + v2\nv8 = sin.(v3)\nv3 == m3 * v3 # recall that m3 = eye(SMatrix{3,3})\n# map, reduce, broadcast, map!, broadcast!, etc...\n\n# Indexing can also be done using static arrays of integers\nv1[1] === 1\nv1[SVector(3,2,1)] === @SVector [3, 2, 1]\nv1[:] === v1\ntypeof(v1[[1,2,3]]) <: Vector # Can't determine size from the type of [1,2,3]\n\n# Is (partially) hooked into BLAS, LAPACK, etc:\nrand(MMatrix{20,20}) * rand(MMatrix{20,20}) # large matrices can use BLAS\neigen(m3) # eigen(), etc uses specialized algorithms up to 3×3, or else LAPACK\n\n# Static arrays stay statically sized, even when used by Base functions, etc:\ntypeof(eigen(m3)) == Eigen{Float64,Float64,SArray{Tuple{3,3},Float64,2,9},SArray{Tuple{3},Float64,1,3}}\n\n# similar() returns a mutable container, while similar_type() returns a constructor:\ntypeof(similar(m3)) == MArray{Tuple{3,3},Int64,2,9} # (final parameter is length = 9)\nsimilar_type(m3) == SArray{Tuple{3,3},Int64,2,9}\n\n# The Size trait is a compile-time constant representing the size\nSize(m3) === Size(3,3)\n\n# A standard Array can be wrapped into a SizedArray\nm4 = Size(3,3)(rand(3,3))\ninv(m4) # Take advantage of specialized fast methods\n\n# reshape() uses Size() or types to specify size:\nreshape([1,2,3,4], Size(2,2)) == @SMatrix [ 1  3 ;\n                                            2  4 ]\ntypeof(reshape([1,2,3,4], Size(2,2))) === SizedArray{Tuple{2, 2},Int64,2,1}\n","category":"page"}]
}
