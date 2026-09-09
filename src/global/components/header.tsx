import { useLocation } from "@tanstack/react-router"
import { LogIn, Search, ShoppingCart } from "lucide-react"; 
import { Button } from "./ui/button";

export const Header = () => {
    const location = useLocation();

    return (
        <section className="flex flex-row justify-between items-start w-full h-11.25 border-b-[0.3px] border-b-primaria/40">
            <h1 className="font-roboto-mono text-background">
                KURIO
            </h1>

            <nav className="flex flex-row items-start font-roboto-mono gap-10 h-full">
                <button className={`flex justify-center items-start text-[16px] cursor-pointer h-full border-b-2 ${location.pathname === '/' ? 'text-accent border-accent' : 'text-background border-transparent'}`}>
                    <a href="">Início</a>
                </button>
                 <button className={`flex justify-center items-start text-[16px] cursor-pointer h-full border-b-2 ${location.pathname === '/market' ? 'text-accent border-accent' : 'text-background border-transparent'}`}>
                    <a href="">Mercado</a>
                </button>
                 <button className={`flex justify-center items-start text-[16px] cursor-pointer h-full border-b-2 ${location.pathname === '/creators' ? 'text-accent border-accent' : 'text-background border-transparent'}`}>
                    <a href="">Criadores</a>
                </button>
                 <button className={`flex justify-center items-start text-[16px] cursor-pointer h-full border-b-2 ${location.pathname === '/learn' ? 'text-accent border-accent' : 'text-background border-transparent'}`}>
                    <a href="">Aprenda</a>
                </button>
            </nav>

            <aside className="flex flex-row justify-center items-center gap-7 h-full pb-5">
                <Search className="text-background"/>
                <ShoppingCart className="text-background"/>
                <Button className="h-8.75 bg-accent text-foreground cursor-pointer hover:bg-accent/90 active:bg-accent/80 focus:ring-accent/40">
                    <LogIn />
                    Entrar
                </Button>
            </aside>
        </section>
    )
}