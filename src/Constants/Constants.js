import img_1 from "../images/1_4.png";
import img_2 from "../images/2_2.png";
import img_3 from "../images/3_1.png";
import img_4 from "../images/4_3.png";
import img_5 from "../images/5_1.png";
import img_6 from "../images/6_1.png";
import img_7 from "../images/7_2.png";
import img_8 from "../images/8_3.png";
import img_9 from "../images/9_2.png";
import img_10 from "../images/10_3.png";
import img_11 from "../images/11_2.png";
import img_12 from "../images/12_1.png";
import img_13 from "../images/13_2.png";
import img_14 from "../images/14_2.png";
import img_15 from "../images/15_3.png";
import img_16 from "../images/16_5.png";
import img_17 from "../images/17_3.png";
import img_18 from "../images/18_3.png";
import img_19 from "../images/19_3.png";
import img_20 from "../images/20_4.png";
import img_21 from "../images/21_8.png";
import img_22 from "../images/22_9.png";
import img_23 from "../images/23_4.png";
import img_24 from "../images/24_1.png";

const images = {
    1: img_1,
    2: img_2,
    3: img_3,
    4: img_4,
    5: img_5,
    6: img_6,
    7: img_7,
    8: img_8,
    9: img_9,
    10: img_10,
    11: img_11,
    12: img_12,
    13: img_13,
    14: img_14,
    15: img_15,
    16: img_16,
    17: img_17,
    18: img_18,
    19: img_19,
    20: img_20,
    21: img_21,
    22: img_22,
    23: img_23,
    24: img_24,
};

export function getCardImage(id) {
    return images[id];
}

const constants = {
    HOVER_HEIGHT : 0.3,
    SNAP_HEIGHT : 0.1,
    TILE_SNAP_DISTANCE: 0.5,
    MEEPLE_OFFSET: 0.35,
    MEEPLE_SNAP_DISTANCE: 0.2
};

export default constants;