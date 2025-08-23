export const navbarLinks = [
    {
        label: "Home",
        route: "/#home",
        isDropdown: false,
        dropdownItems: [
            {
                label: "",
                route: "",
            },
        ]
    },
    {
        label: "About",
        route: "/#about",
        isDropdown: true,
        dropdownItems: [
            {
                label: "About Me",
                route: "/#about",
            },
            {
                label: "My Portfolio",
                route: "/#portfolio",
            },
            {
                label: "My Resume",
                route: "/#resume",
            },
            {
                label: "Certifications",
                route: "/certifications",
            },
        ]
    },
    {
        label: "Blog",
        route: "/blog",
        isDropdown: false,
        dropdownItems: [
            {
                label: "",
                route: "",
            },
        ]
    }
];

export const mobileNavLinks = [
    {
        label: "Home",
        route: "/#home",
    },
    {
        label: "About",
        route: "/#about",
    }, {
        label: "Blog",
        route: "/blog",
    },
    {
        label: "Portfolio",
        route: "/#portfolio",
    },
    {
        label: "Resume",
        route: "/#resume",
    },
    {
        label: "Certifications",
        route: "/certifications",
    },
];
