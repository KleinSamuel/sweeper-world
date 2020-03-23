import "./css/style.css";

import MinefieldViewer from "./MinefieldViewer";
import MinefieldModel from "./MinefieldModel";
import TextureLoader from "./TextureLoader";

let textureLoader = new TextureLoader();

let minefieldModel = new MinefieldModel();
minefieldModel.init();

let viewer = new MinefieldViewer(minefieldModel, textureLoader);