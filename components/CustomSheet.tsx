import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChildrenProp {
  children: React.ReactNode;
}

interface TitleProp extends ChildrenProp {
  title: string;
}
const CustomSheet: React.FC<TitleProp> = ({ title, children }) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="border rounded-lg text-body-bold bg-white py-3 w-48 hover:bg-black hover:text-white">
          {title}
        </SheetTrigger>
        <SheetContent className="bg-grey-1">
          <SheetHeader>
            <SheetTitle className="text-heading4-bold pb-4">{title}</SheetTitle>
            <SheetDescription>{children}</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CustomSheet;
