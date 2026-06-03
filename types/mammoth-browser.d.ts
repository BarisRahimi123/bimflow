// mammoth ships a browser bundle (no node deps) under this subpath but only
// declares types for the main entry. Re-use the main entry's types here.
declare module "mammoth/mammoth.browser" {
  import mammoth from "mammoth";
  export default mammoth;
}
