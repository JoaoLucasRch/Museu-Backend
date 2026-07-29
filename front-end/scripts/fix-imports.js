import fs from "fs";
import path from "path";


const SRC = "./src";


const EXTENSIONS = [
    ".ts",
    ".tsx"
];


const ALIASES = [
    "components",
    "hooks",
    "services",
    "types",
    "utils",
];



function getFiles(folder) {

    let files = [];


    for (
        const item of fs.readdirSync(
            folder,
            {
                withFileTypes:true
            }
        )
    ) {


        const full =
            path.join(
                folder,
                item.name
            );


        if (
            item.isDirectory()
        ) {

            files.push(
                ...getFiles(full)
            );

        }


        else if (
            EXTENSIONS.includes(
                path.extname(
                    item.name
                )
            )
        ) {

            files.push(full);

        }

    }


    return files;

}





function normalizeImport(
    currentFile,
    importPath
) {


    if (
        !importPath.startsWith(".")
    ) {
        return importPath;
    }



    const absolute =
        path.resolve(
            path.dirname(
                currentFile
            ),
            importPath
        );



    const src =
        path.resolve(
            SRC
        );



    const relative =
        path.relative(
            src,
            absolute
        );



    const parts =
        relative.split(
            path.sep
        );



    if (
        ALIASES.includes(
            parts[0]
        )
    ) {


        return (
            "@/" +
            parts.join("/")
        );

    }


    return importPath;

}






function processFile(file) {


    let content =
        fs.readFileSync(
            file,
            "utf8"
        );



    const regex =
        /from\s+["']([^"']+)["']/g;



    content =
        content.replace(
            regex,
            (
                match,
                importPath
            ) => {


                const fixed =
                    normalizeImport(
                        file,
                        importPath
                    );


                return `from "${fixed}"`;

            }
        );



    fs.writeFileSync(
        file,
        content
    );


    console.log(
        "✓",
        file
    );

}





const files =
    getFiles(
        SRC
    );



files.forEach(
    processFile
);



console.log(
    "\n✅ Imports corrigidos."
);