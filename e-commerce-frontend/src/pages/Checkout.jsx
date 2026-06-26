import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";

export default function CheckoutPage() {
    const navigate = useNavigate();

    const { cart, getCartTotal } = useCart();

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        county: "",
        town: "",
        estate: "",
        streetAddress: "",
        landmark: "",
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        sessionStorage.setItem(
            "checkoutAddress",
            JSON.stringify(formData)
        );

        navigate("/checkout/review");
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold">
                    Your cart is empty
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">

            <h1 className="text-3xl font-bold mb-8">
                Checkout
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Address Form */}

                <div className="lg:col-span-2">

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white shadow rounded-xl p-6 space-y-5"
                    >

                        <h2 className="text-xl font-semibold">
                            Delivery Address
                        </h2>

                        <input
                            name="fullName"
                            placeholder="Full Name"
                            className="w-full border rounded-lg p-3"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="phoneNumber"
                            placeholder="Phone Number"
                            className="w-full border rounded-lg p-3"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="county"
                            placeholder="County"
                            className="w-full border rounded-lg p-3"
                            value={formData.county}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="town"
                            placeholder="Town"
                            className="w-full border rounded-lg p-3"
                            value={formData.town}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="estate"
                            placeholder="Estate"
                            className="w-full border rounded-lg p-3"
                            value={formData.estate}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            rows={3}
                            name="streetAddress"
                            placeholder="Street Address"
                            className="w-full border rounded-lg p-3"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            rows={2}
                            name="landmark"
                            placeholder="Landmark (Optional)"
                            className="w-full border rounded-lg p-3"
                            value={formData.landmark}
                            onChange={handleChange}
                        />

                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Continue
                        </button>

                    </form>

                </div>

                {/* Order Summary */}

                <div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-3">

                            {cart.map(item => (

                                <div
                                    key={item.productId}
                                    className="flex justify-between"
                                >

                                    <div>
                                        <p>{item.productName}</p>
                                        <small>
                                            Qty {item.quantity}
                                        </small>
                                    </div>

                                    <span>
                                        KSh {item.subTotal.toLocaleString()}
                                    </span>

                                </div>

                            ))}

                        </div>

                        <hr className="my-5"/>

                        <div className="flex justify-between font-bold text-lg">

                            <span>Total</span>

                            <span>
                                KSh {getCartTotal().toLocaleString()}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}