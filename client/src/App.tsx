import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Stays from "@/pages/stays";
import UnitDetail from "@/pages/unit-detail";
import Rates from "@/pages/rates";
import Amenities from "@/pages/amenities";
import About from "@/pages/about";
import Terms from "@/pages/terms";
import Contact from "@/pages/contact";
import Booking from "@/pages/booking";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ChatbotWidget from "@/components/chatbot-widget";

function Router() {
  return (
    <>
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/stays" component={Stays} />
          <Route path="/stays/:slug" component={UnitDetail} />
          <Route path="/rates" component={Rates} />
          <Route path="/amenities" component={Amenities} />
          <Route path="/about" component={About} />
          <Route path="/terms" component={Terms} />
          <Route path="/contact" component={Contact} />
          <Route path="/booking" component={Booking} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
