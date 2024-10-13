{
  description = "Flake for Simple planning poker";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {

    packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;

    packages.x86_64-linux.default = self.packages.x86_64-linux.hello;

    devShells.x86_64-linux =
      let
        pkgs = nixpkgs.legacyPackages.x86_64-linux;
      in
        {
          
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs-slim_22
              pnpm_9
              pre-commit
            ];
          };
        };
  };
}
