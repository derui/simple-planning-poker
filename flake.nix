{
  description = "Flake for Simple planning poker";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {

    devShells.x86_64-linux =
      let
        pkgs = nixpkgs.legacyPackages.x86_64-linux;
      in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_22
              pnpm_9
              pre-commit
              nodePackages.typescript-language-server
              openjdk17
            ];

            shellHook = ''
              pre-commit install
            '';
          };
        };
  };
}
