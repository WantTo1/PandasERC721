const { expect } = require("chai");

describe("Farm contract", () => {
  let Elems, elems, owner, addr1, addr2;

  beforeEach(async () => {
    Elems = await hre.ethers.getContractFactory("Elems");

    elems = await Elems.deploy();

    [owner, addr1, addr2] = await hre.ethers.getSigners();
  });

  describe("Mint", function () {
    it("Should mint", async function () {
      await elems.mintNFT(owner.address, "link");
      await elems.mintNFT(owner.address, "link");

      expect(await elems.balanceOf(owner.address)).to.equal("2");
    });

    it("Should give minter role", async function () {
      await elems.grantRole(
        "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
        addr1.address
      );
      await elems.connect(addr1).mintNFT(addr1.address, "link");

      expect(await elems.balanceOf(addr1.address)).to.equal("1");
    });

    it("Should mint without minter role", async function () {
      await expect(
        elems.connect(addr1).mintNFT(addr1.address, "link")
      ).to.be.revertedWith("Caller is not a minter");
    });

    it("Should check the owner", async function () {
      await elems.mintNFT(owner.address, "link");

      expect(await elems.ownerOf(1)).to.equal(owner.address);
    });

    it("Should check tokenURI", async function () {
      await elems.mintNFT(owner.address, "link");

      expect(await elems.tokenURI(1)).to.equal("link");
    });

    it("Should check tokenURI if dont have token", async function () {
      await elems.mintNFT(owner.address, "link");

      await expect(elems.tokenURI(2)).to.be.revertedWith(
        "ERC721URIStorage: URI query for nonexistent token"
      );
    });
  });

  describe("SafeTransferFrom", function () {
    it("Should transfer with approval", async function () {
      await elems.mintNFT(owner.address, "link");
      await elems.approve(addr1.address, 1);
      await elems["safeTransferFrom(address,address,uint256)"](
        owner.address,
        addr1.address,
        1
      );

      expect(await elems.balanceOf(addr1.address)).to.equal("1");
    });

    it("Should transfer withot approval", async function () {
      await elems.mintNFT(owner.address, "link");

      await expect(
        elems
          .connect(addr1)
          ["safeTransferFrom(address,address,uint256)"](
            owner.address,
            addr1.address,
            1
          )
      ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });

    it("Should approval owner to owner", async function () {
      await elems.mintNFT(owner.address, "link");
      await expect(elems.approve(owner.address, 1)).to.be.revertedWith(
        "ERC721: approval to current owner"
      );
    });

    it("Should approval foreign tokens", async function () {
      await elems.mintNFT(owner.address, "link");
      await expect(
        elems.connect(addr1).approve(addr1.address, 1)
      ).to.be.revertedWith(
        "ERC721: approve caller is not owner nor approved for all"
      );
    });

    it("Should approval if dont have token", async function () {
      await expect(elems.approve(addr1.address, 1)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });
  });

  describe("Burn", function () {
    it("Should burn", async function () {
      await elems.mintNFT(owner.address, "link");
      await elems.mintNFT(owner.address, "link");

      await elems.burnNFT(owner.address, 1);

      expect(await elems.balanceOf(owner.address)).to.equal("1");
    });

    it("Should burn without burner role", async function () {
      await elems.mintNFT(addr1.address, "link");
      await expect(
        elems.connect(addr1).burnNFT(addr1.address, 1)
      ).to.be.revertedWith("Caller is not a burner");
    });

    it("Should burn if you have burner role", async function () {
      await elems.grantRole(
        "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
        addr1.address
      );
      await elems.mintNFT(addr2.address, "link");
      await elems.connect(addr1).burnNFT(addr2.address, 1);

      expect(await elems.balanceOf(addr2.address)).to.equal("0");
    });

    it("Should burn if you have admin role", async function () {
      await elems.mintNFT(addr1.address, "link");
      await elems.burnNFT(addr1.address, 1);

      expect(await elems.connect(addr1).balanceOf(addr1.address)).to.equal("0");
    });
  });
});
