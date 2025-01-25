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
          default = (pkgs.buildFHSEnv {
            name = "playwright";

            targetPkgs =
              pkgs: with pkgs; [
                nodejs_22
                pnpm_9
                pre-commit
                nodePackages.typescript-language-server
                openjdk17
                openssl
                systemd
                glibc
                glibc.dev
                glib
                cups.lib
                cups
                nss
                nssTools
                alsa-lib
                dbus
                at-spi2-core
                libdrm
                expat
                xorg.libX11
                xorg.libXcomposite
                xorg.libXdamage
                xorg.libXext
                xorg.libXfixes
                xorg.libXrandr
                xorg.libxcb
                mesa
                libxkbcommon
                pango
                cairo
                nspr
              ];

            profile = ''
              export LD_LIBRARY_PATH=/run/opengl-driver/lib:/run/opengl-driver-32/lib:/lib
              export FONTCONFIG_FILE=/etc/fonts/fonts.conf
            '';

            unshareUser = false;
            unshareIpc = false;
            unsharePid = false;
            unshareNet = false;
            unshareUts = false;
            unshareCgroup = false;
            dieWithParent = true;
          }).env;
          # default = pkgs.mkShell {
          #   buildInputs = with pkgs; [
          #     nodejs_22
          #     pnpm_9
          #     pre-commit
          #     nodePackages.typescript-language-server
          #     openjdk17

          #     # for test in NixOS
          #     playwright-test
          #     play
          #   ];

          #   shellHook = ''
          #     pre-commit install
          #   '';
          # };
        };
  };
}
