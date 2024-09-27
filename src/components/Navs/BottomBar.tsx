import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import KofiButton from "../KofiButton";

const socials = [
  {
    href: "https://github.com/ljreaux/MeadTools-React/tree/main",
    logo: <FaGithub />,
  },
  {
    href: "https://www.linkedin.com/in/ljreaux/",
    logo: <FaLinkedin />,
  },
  {
    href: "https://discord.gg/Wbx9DWWqFC",
    logo: <FaDiscord />,
  },
  {
    href: "https://www.facebook.com/profile.php?id=61555860082002",
    logo: <FaFacebook />,
  },
  {
    href: "https://www.instagram.com/meadtools/",
    logo: <AiFillInstagram />,
  },
  {
    href: "https://ko-fi.com/meadtools",
    logo: <KofiButton />,
  },
];

export default function BottomBar() {
  return (
    <footer className="fixed bottom-0 left-0 w-screen text-foreground">
      <div className="w-full ">
        <span className="sm:flex sm:w-full sm:justify-center">
          <div className="flex items-center justify-center w-full gap-1 text-xl sm:w-fit sm:px-4 sm:my-2 sm:rounded-2xl bg-background sm:border-2 sm:border-foreground">
            {socials.map((social) => {
              return (
                <a
                  href={social.href}
                  className="py-2 transition-all hover:text-secondary md:hover:scale-105"
                  key={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.logo}
                </a>
              );
            })}

            <Link
              to="/contact"
              className="py-2 transition-all hover:text-secondary md:hover:scale-105"
            >
              <MdEmail />
            </Link>
          </div>
        </span>
      </div>
    </footer>
  );
}
