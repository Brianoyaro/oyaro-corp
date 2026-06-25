import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
} from "lucide-react";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const { getCartItemCount } =
    useContext(CartContext);

  const {
    isAuthenticated,
    user,
    logout,
  } = useContext(AuthContext);

  const cartCount = getCartItemCount();

  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-white/95
        backdrop-blur-md
        border-b
        border-gray-200
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          h-16
          flex
          items-center
          justify-between
          gap-4
        "
      >
        {/* Logo */}

        <Link
          to="/"
          className="
            text-xl
            font-bold
            text-gray-900
            shrink-0
          "
        >
          ShopHub
        </Link>

        {/* Search */}

        <div
          className="
            hidden
            md:flex
            items-center
            flex-1
            max-w-xl
            mx-6
            relative
          "
        >
          <Search
            size={18}
            className="
              absolute
              left-4
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search products..."
            className="
              w-full
              pl-11
              pr-4
              py-2.5
              border
              border-gray-300
              rounded-full
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Desktop Menu */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-5
          "
        >
          <Link
            to="/products"
            className="
              text-gray-700
              hover:text-black
            "
          >
            Products
          </Link>

          {/* Cart */}

          <Link
            to="/cart"
            className="relative"
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  min-w-[20px]
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                  px-1
                "
              >
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span className="text-sm">
                {user?.name}
              </span>

              <button
                onClick={logout}
                className="
                  text-sm
                  px-4
                  py-2
                  border
                  rounded-lg
                  hover:bg-gray-100
                "
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                border
                rounded-full
                hover:shadow-md
              "
            >
              <User size={18} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Controls */}

        <div
          className="
            flex
            md:hidden
            items-center
            gap-4
          "
        >
          <Link
            to="/cart"
            className="relative"
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  min-w-[18px]
                  h-[18px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      {mobileMenuOpen && (
        <div
          className="
            md:hidden
            border-t
            bg-white
          "
        >
          <div className="p-4 space-y-4">

            <div className="relative">
              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search products..."
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  border
                  rounded-full
                "
              />
            </div>

            <Link
              to="/products"
              className="
                block
                py-2
              "
              onClick={() =>
                setMobileMenuOpen(false)
              }
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="
                block
                py-2
              "
              onClick={() =>
                setMobileMenuOpen(false)
              }
            >
              Cart ({cartCount})
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="
                    block
                    py-2
                  "
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="
                    w-full
                    py-3
                    bg-gray-100
                    rounded-xl
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="
                  block
                  text-center
                  py-3
                  bg-blue-600
                  text-white
                  rounded-xl
                "
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}