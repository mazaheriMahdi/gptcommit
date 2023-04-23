class Gptcommit < Formula
  desc "A tool for creating commit messages using GPT-3"
  homepage "https://github.com/mazaheriMahdi/gptcommit"
  url "https://github.com/mazaheriMahdi/gptcommit/releases/download/v1.0.0-alpha/gptcommit-macos-v1-beta-x64.tar.gz"
  sha256 "85360909cf2943f401d11b90e8b282fb6a32c2936085997e511d6705bed0ebb2"
  version "1.0.0-alpha"
  def install
    bin.install "gptcommit"
  end
end
