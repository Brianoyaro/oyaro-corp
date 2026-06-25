import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, ShoppingCart, Search } from "lucide-react";
import { useCategories } from "../hook/useCategory";
import { useMemo, useState } from "react";


export default function ProductListView() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const { data: categoriesData, isLoading } = useCategories();
    
    const baseUrl = "http://localhost:8080";

    const getPrimaryImage = (images = []) => {
        const primary = images.find((img) => img.isPrimary);
        return primary || images[0];
    };
    const currencyFormatter = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
    });

    const categoryTabs = useMemo(() => {
        return [
            {
            id: "all",
            name: "All Products",
            },
            ...(categoriesData || []).map((category) => ({
            id: category.id,
            name: category.name,
            })),
        ];
    }, [categoriesData]);

    const filteredCategories = useMemo(() => {
        if (!categoriesData) return [];

        let categories = categoriesData;

        if (selectedCategory !== "all") {
            categories = categories.filter(
            (category) => category.id === selectedCategory
            );
        }

        if (!searchTerm.trim()) {
            return categories;
        }

        return categories.map((category) => ({
            ...category,
            products:
                category.products?.filter((product) => {
                const query = searchTerm.toLowerCase();

                return (
                    product.name?.toLowerCase().includes(query) ||
                    product.description?.toLowerCase().includes(query) ||
                    product.attributes?.some(
                    (attr) =>
                        attr.attributeName
                        ?.toLowerCase()
                        .includes(query) ||
                        attr.attributeValue
                        ?.toLowerCase()
                        .includes(query)
                    )
                );
                }) || [],
            }))
            .filter((category) => category.products.length > 0);
        }, [categoriesData, selectedCategory, searchTerm]);

        //

    if (isLoading) {
        return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10">
            <div className="animate-pulse space-y-10">
            {[1, 2, 3].map((item) => (
                <div key={item}>
                <div className="h-8 w-56 bg-gray-200 rounded mb-6" />

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((card) => (
                    <div
                        key={card}
                        className="bg-gray-200 h-80 rounded-xl"
                    />
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>
        );
    }

    return (
        <div>

        {/* HERO */}

        {/* <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-16">

            <div className="max-w-3xl">
                <h1 className="text-5xl font-bold">
                Discover Amazing Products
                </h1>

                <p className="mt-4 text-lg text-blue-100">
                Shop quality products at affordable prices.
                </p>

                <div className="mt-8 flex items-center gap-3">
                <ShoppingBag size={22} />
                <span>
                    {categoriesData?.reduce(
                    (sum, category) =>
                        sum + (category.products?.length || 0),
                    0
                    )}{" "}
                    Products Available
                </span>
                </div>
            </div>

            </div>
        </section> */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10">
            {/* Search */}
            <div className="relative mb-6 sm:mb-8">
                <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                    w-full
                    pl-12
                    pr-4
                    py-3
                    text-sm
                    sm:text-base
                    border
                    rounded-xl
                    focus:ring-2
                    focus:ring-blue-500
                    focus:outline-none
                "
                />
            </div>

            {/* Category Tabs */}

            <div
                className="
                    sticky
                    top-0
                    z-20
                    bg-white
                    py-3
                    flex
                    gap-2
                    overflow-x-auto
                    scrollbar-hide
                    mb-6
                "
            >
                {categoryTabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`
                    whitespace-nowrap
                    text-sm
                    sm:text-base
                    px-5
                    py-2
                    rounded-full
                    whitespace-nowrap
                    transition
                    ${
                        selectedCategory === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                    `}
                >
                    {tab.name}
                </button>
                ))}
            </div>
            {filteredCategories.length === 0 && (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold">
                    No products found
                    </h2>

                    <p className="text-gray-500 mt-2">
                    Try a different search term.
                    </p>
                </div>
                )}

            </div>

        {/* CATEGORY SECTIONS */}

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-1 space-y-16">

            {filteredCategories?.map((category) => (
            <section key={category.id}>

                {/* Category Header */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">

                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {category.name}
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                    {category.description}
                    </p>
                </div>

                {/* <div className="hidden md:block"> */}
                <div>
                    <span className="text-xs sm:text-sm text-gray-500">
                    {category.products?.length || 0} Products
                    </span>
                </div>

                </div>

                {/* Products */}

                {category.products?.length > 0 ? (
                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                        gap-4
                        sm:gap-6
                    "
                >
                    {category.products.slice(0, 8).map((product) => {
                    const image =
                        getPrimaryImage(product.images);

                    return (
                        <div
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="
                            group
                            // min-w-[280px]
                            // lg:min-w-0
                            bg-white
                            rounded-2xl
                            overflow-hidden
                            border
                            border-gray-200
                            shadow-sm
                            hover:shadow-xl
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            flex
                            flex-col
                            h-full
                        "
                        >

                        {/* IMAGE */}
                        <Link to={`/product/${product.id}`}>
                            <div className="overflow-hidden relative">
                                <img
                                src={
                                    image
                                    ? `${baseUrl}${image.imgUrl}`
                                    : "/placeholder.png"
                                }
                                alt={product.name}
                                className="
                                    w-full
                                    h-50
                                    sm:h-60
                                    lg:h-64
                                    object-cover
                                    transition-transform
                                    duration-500
                                    group-hover:scale-110
                                "
                                />

                                <div
                                className="
                                    absolute
                                    inset-0
                                    bg-black/0
                                    group-hover:bg-black/10
                                    transition
                                "
                                />
                            </div>
                        </Link>

                        {/* CONTENT */}

                        <div className="p-4 sm:p-5 flex flex-col flex-1">
                            <Link to={`/product/${product.id}`}>
                                <h3
                                className="
                                    font-semibold
                                    text-lg
                                    text-gray-900
                                    line-clamp-1
                                "
                                >
                                {product.name}
                                </h3>
                            </Link>

                            <p
                            className="
                                mt-2
                                text-sm
                                text-gray-500
                                line-clamp-2
                            "
                            >
                            {product.description}
                            </p>

                            {/* Attributes */}

                            {product.attributes?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {product.attributes
                                .slice(0, 2)
                                .map((attribute) => (
                                    <span
                                    key={attribute.id}
                                    className="
                                        px-2
                                        py-1
                                        bg-gray-100
                                        rounded-full
                                        text-xs
                                    "
                                    >
                                    {attribute.attributeValue}
                                    </span>
                                ))}
                            </div>
                            )}

                            {/* Footer */}
                            <div className="mt-auto pt-5">
                                <div className="flex items-center justify-between">

                                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                                    {currencyFormatter.format(product.price)}
                                </span>

                                <Link
                                    to={`/product/${product.id}`}
                                    className="
                                    text-blue-600
                                    font-medium
                                    hover:underline
                                    "
                                    >
                                    View
                                </Link>

                            </div>
                                </div>

                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO:
                                    // addToCart(product.id, 1)
                                    }}
                                    className="
                                        w-full
                                        mt-4
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        bg-blue-600
                                        whitespace-nowrap
                                        text-sm
                                        sm:text-base
                                        text-white
                                        sm:py-3
                                        py-2.5
                                        rounded-xl
                                        hover:bg-blue-700
                                        transition
                                    "
                                >
                                <ShoppingCart size={18} />
                                Add To Cart
                                </button>

                        </div>

                        </div>
                    );
                    })}
                </div>
                ) : (
                <div
                    className="
                    bg-gray-50
                    rounded-xl
                    border
                    p-8
                    text-center
                    "
                >
                    <p className="text-gray-500">
                    No products available in this category.
                    </p>
                </div>
                )}

            </section>
            ))}

        </div>
        </div>
    );
}