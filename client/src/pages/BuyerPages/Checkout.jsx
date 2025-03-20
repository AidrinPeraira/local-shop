import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Container } from "../../components/ui/container";
import CheckoutContent from "../../components/Checkout/CheckoutContent";
import { useSelector } from "react-redux";
import { useToast } from "../../components/hooks/use-toast";

const Checkout = () => {
  const cart = useSelector((state) => state.cart.cart);
  const {toast} = useToast()
  
  if(!cart){
    toast({
      title: "Cart is empty",
      description: "Please add some items to your cart",
      variant : "destructive"
    })
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-10">
        <Container>
          <CheckoutContent />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
