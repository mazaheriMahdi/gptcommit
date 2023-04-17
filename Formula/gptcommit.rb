class Gptcommit < Formula
  desc "A tool for creating commit messages using GPT-3"
  homepage "https://github.com/mazaheriMahdi/gptcommit"
  url "https://github.com/mazaheriMahdi/gptcommit/releases/download/v1.0.0-alpha/gptcommit-macos-v1-beta-x64.tar.gz"
  sha256 "f71ef679087176675d21ebcea92210b899b1cf358d3891bb7f40925f"
  version "1.0.0-alpha"
  def install
    bin.install "gptcommit"
  end
end
