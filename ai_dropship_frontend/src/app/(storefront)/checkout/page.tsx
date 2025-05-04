
"use client"; // Ensure this is a client component as it uses hooks (useCart)
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button"; // Assuming Button component exists
import { Input } from "@/components/ui/input"; // Assuming Input component exists
import { Label } from "@/components/ui/label"; // Assuming Label component exists
import { useState } from "react";

export default function CheckoutPage() { // Renamed to avoid conflict with HTML tags
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    email: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual checkout logic (e.g., API call to process payment)
    console.log("Submitting checkout form:", formData);
    console.log("Cart items:", cart);
    // Redirect to order confirmation page upon successful checkout
    // Example: router.push("/order-confirmation/some-order-id");
    alert("Checkout submitted (mock)! See console for details.");
  };

  return (
    <div className="checkout container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="cart-items space-y-4 border rounded-lg p-4 bg-gray-50">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item flex justify-between items-center border-b pb-2">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
            {cart.length > 0 && (
              <div className="text-right font-bold text-lg mt-4 pt-2 border-t">
                Total: ${totalAmount.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping & Payment</h2>
          <form className="checkout-form space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="address">Shipping Address</Label>
              <Input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                type="text" 
                id="cardNumber" 
                name="cardNumber" 
                placeholder="xxxx xxxx xxxx xxxx" 
                value={formData.cardNumber} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input 
                  type="text" 
                  id="expiry" 
                  name="expiry" 
                  placeholder="MM/YY" 
                  value={formData.expiry} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input 
                  type="text" 
                  id="cvc" 
                  name="cvc" 
                  placeholder="123" 
                  value={formData.cvc} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-4" disabled={cart.length === 0}>
              Complete Purchase
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

