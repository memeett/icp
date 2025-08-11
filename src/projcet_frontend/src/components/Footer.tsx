import { Button } from "./ui/Button";

function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Ergasia. All rights
                    reserved.
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Button variant="link" className="text-muted-foreground">
                        Terms of Service
                    </Button>
                    <Button variant="link" className="text-muted-foreground">
                        Privacy Policy
                    </Button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;