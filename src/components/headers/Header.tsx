import { ModeToggle } from "../dropdowns/ModeToggle";
import { Navigation } from "../navigations/Navigation";
import ImageComponent from "../image/Image";
// import logo from "../../public/gaumes_logo.png";

export default function Header() {
  return (
    <main>
      <div className="flex justify-between items-center p-4">
        <div>
        {/* <ImageComponent src={logo} alt="logo" height={20} width={120} /> */}
        </div>
        <div className="flex-grow flex justify-center"> {/* Adicione a classe justify-center */}
          <Navigation />
        </div>
        <div className="min-w-[120px]">
        <ModeToggle />
        </div>
      </div>
    </main>
  );
}
