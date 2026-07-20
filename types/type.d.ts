// Ambient declarations for side-effect / module CSS imports (fixes ts(2882)).
declare module "*.css";

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
