// place files you want to import through the `$lib` alias in this folder.
export const getListLanguage = async () => {
    const response = await fetch("https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json")
    const result = await response.json()
    return result
}