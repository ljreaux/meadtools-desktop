import { useEffect, useState } from "react";
import {
  SelectValue,
  SelectTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "./select";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState(["en", "de"]);
  const lang = i18n.resolvedLanguage?.substring(0, 2);
  useEffect(() => {
    const langs = i18n.languages.map((lang) => lang.substring(0, 2));
    const noDup = [...new Set(langs)];
    setLanguages(noDup);
  }, []);

  return (
    <Select
      value={lang}
      onValueChange={(val) => {
        i18n.changeLanguage(val);
      }}
    >
      <SelectTrigger className="w-full ">
        <SelectValue placeholder="EN" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languages.map((language) => {
            return (
              <SelectItem key={language} value={language}>
                {language.toUpperCase()}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default LanguageSwitcher;
