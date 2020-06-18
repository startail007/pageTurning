(function () {
  Object.defineProperty(Math, "crop", {
    value: function (value, min, max) {
      if (min === undefined) {
        min = 0;
      }
      if (max === undefined) {
        max = 1;
      }
      if (value <= min) {
        return min;
      }
      if (value >= max) {
        return max;
      }
      return value;
    },
  });

  Object.defineProperty(SVGPoint.prototype, "set", {
    value: function (x, y) {
      function getArguments(data) {
        var p = { x: 0, y: 0 };
        if (typeof data[0] === "number") {
          p.x = data[0];
          p.y = typeof data[1] === "number" ? data[1] : data[0];
        } else if (typeof data[0] === "object") {
          data[0].x !== undefined && (p.x = data[0].x);
          data[0].y !== undefined && (p.y = data[0].y);
        }
        return p;
      }
      var p = getArguments(arguments);
      this.x = p.x;
      this.y = p.y;
      return this;
    },
  });
  Object.defineProperty(SVGLinearGradientElement.prototype, "setLine", {
    value: function (x1, y1, x2, y2) {
      this.x1.baseVal.value = x1;
      this.y1.baseVal.value = y1;
      this.x2.baseVal.value = x2;
      this.y2.baseVal.value = y2;
      return this;
    },
  });

  function getPos(el) {
    var parent = el.offsetParent;
    var parentLeft = 0;
    var parentTop = 0;
    while (parent && parent !== this.$el) {
      parentLeft += parent.offsetLeft + parent.clientLeft;
      parentTop += parent.offsetTop + parent.clientTop;
      parent = parent.offsetParent;
    }
    return {
      left: parentLeft + el.offsetLeft + el.clientLeft,
      top: parentTop + el.offsetTop + el.clientTop,
    };
  }
  var vector2D = function () {
    function getArguments(data) {
      var p = { x: 0, y: 0 };
      if (typeof data[0] === "number") {
        p.x = data[0];
        p.y = typeof data[1] === "number" ? data[1] : data[0];
      } else if (typeof data[0] === "object") {
        data[0].x !== undefined && (p.x = data[0].x);
        data[0].y !== undefined && (p.y = data[0].y);
      }
      return p;
    }
    var p = getArguments(arguments);
    this.x = p.x;
    this.y = p.y;
    this.length = function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    this.slope = function () {
      return this.x / this.y;
    };
    this.dot = function (v) {
      return this.x * v.x + this.y * v.y;
    };
    this.cross = function (v) {
      return this.x * v.y - this.y * v.x;
    };
    this.set = function () {
      var p = getArguments(arguments);
      this.x = p.x;
      this.y = p.y;
      return this;
    };
    this.scale = function () {
      var p = getArguments(arguments);
      this.x *= p.x;
      this.y *= p.y;
      return this;
    };
    this.add = function () {
      var p = getArguments(arguments);
      this.x += p.x;
      this.y += p.y;
      return this;
    };
    this.sub = function (v) {
      var p = getArguments(arguments);
      this.x -= p.x;
      this.y -= p.y;
      return this;
    };
    this.swap = function () {
      var temp = this.x;
      this.x = -this.y;
      this.y = temp;
      return this;
    };
    this.normalize = function () {
      var r = this.length();
      this.x /= r;
      this.y /= r;
      return this;
    };
    this.rotate = function (pAngle) {
      var cos0 = Math.cos(pAngle);
      var sin0 = Math.sin(pAngle);
      var xx = this.x * cos0 - this.y * sin0;
      var yy = this.y * cos0 + this.x * sin0;
      this.x = xx;
      this.y = yy;
      return this;
    };
    this.projection = function (v) {
      var temp = this.dot(v) / v.length();
      return new vector2D(v.x * temp, v.y * temp);
    };
    this.clone = function () {
      return new vector2D(this.x, this.y);
    };
  };
  var transform = function () {
    var value = "";
    this.clear = function () {
      value = "";
      return this;
    };
    this.toString = function () {
      return value;
    };
    this.addTranslateX = function (pValue) {
      value += " translateX(" + pValue * 100 + "%)";
      return this;
    };
    this.addTranslateY = function (pValue) {
      value += " translateY(" + pValue * 100 + "%)";
      return this;
    };
    this.addScaleX = function (pValue) {
      value += " scaleX(" + pValue + ")";
      return this;
    };
    this.addScaleY = function (pValue) {
      value += " scaleY(" + pValue + ")";
      return this;
    };
    this.addSkewX = function (pValue) {
      value += " skewX(" + pValue + "deg)";
      return this;
    };
    this.addRotate = function (pValue) {
      value += " rotate(" + pValue + "deg)";
      return this;
    };
  };
  var polygon = function () {
    var value = "";
    this.clear = function () {
      value = "";
      return this;
    };
    this.toString = function () {
      if (value === "") {
        return "";
      }
      return "polygon(" + value.substring(1, value.length - 1) + ")";
    };
    this.addPoint = function (pX, pY) {
      value += " " + pX * 100 + "% " + pY * 100 + "%,";
      return this;
    };
    this.addPoints = function (pA) {
      pA.forEach(function (el) {
        this.addPoint(el[0], el[1]);
      }, this);
      return this;
    };
  };
  window.addEventListener("load", function () {
    var book = document.querySelector(".book");
    var content = book.querySelector(".content");
    var bottom = book.querySelector(".bottom");
    var bottomPage_left = bottom.querySelector(".bottomPage.left");
    var bottomPage_right = bottom.querySelector(".bottomPage.right");
    /*var openedBack = book.querySelector(".openedBack");
    var openedCorner = book.querySelector(".openedCorner");*/
    var back = book.querySelector(".back");
    var corner = book.querySelector(".corner");
    var pagesList = [];
    var pages = document.querySelector(".pages");

    var bottomPage_left_item = bottomPage_left.querySelector(".item");
    var bottomPage_right_item = bottomPage_right.querySelector(".item");
    var back_item = back.querySelector(".item");
    var corner_item = corner.querySelector(".item");
    var openedCorner = book.querySelector(".openedCorner");

    var shadow = openedCorner.querySelector(".shadow");
    var shadow01 = openedCorner.querySelector(".shadow01");
    var shadow02 = openedCorner.querySelector(".shadow02");

    var corner_shadow01_color = openedCorner.querySelector("#shadow01");
    var corner_shadow02_color = openedCorner.querySelector("#shadow02");
    //var bookControl = document.querySelector(".bookControl");
    var buttonPrev = document.querySelector(".bookControl .button.prev");
    var buttonNext = document.querySelector(".bookControl .button.next");

    //console.log(shadow01.width);

    var pagesChildren = pages.children;
    for (var i = 0; i < pagesChildren.length; i++) {
      var el = pagesChildren[i];
      pagesList[i] = el.cloneNode(true);
    }

    var PI180 = Math.PI / 180;
    var width = Math.min(500, (window.innerWidth - 20) / 2);
    var height = Math.min(400, window.innerHeight - 140);
    var rate = width / height;
    //var hypotenuse = Math.sqrt(width * width + height * height);
    console.log(window.innerWidth);

    book.style.width = width * 2 + "px";
    book.style.height = height + "px";
    content.style.width = width * 2 + "px";
    content.style.height = height + "px";
    back.style.width = width + "px";
    back.style.height = height + "px";
    corner.style.width = width + "px";
    corner.style.height = height + "px";
    bottomPage_left.style.width = width + "px";
    bottomPage_left.style.height = height + "px";
    bottomPage_right.style.width = width + "px";
    bottomPage_right.style.height = height + "px";
    bottomPage_right.style.left = width + "px";
    //book.style.padding = hypotenuse - height + 20 + "px" + " " + 20 + "px";//擴展延伸空間
    shadow.style.width = width * 2;
    shadow.style.height = height;
    shadow01.x.baseVal.value = 0;
    shadow01.y.baseVal.value = 0;
    shadow01.width.baseVal.value = width * 2;
    shadow01.height.baseVal.value = height;
    shadow02.x.baseVal.value = 0;
    shadow02.y.baseVal.value = 0;
    shadow02.width.baseVal.value = width * 2;
    shadow02.height.baseVal.value = height;

    function getCornerPolygon(up, down, side, type) {
      var polygon01 = new polygon();
      if (type.charAt(0) === "r") {
        if (type.charAt(1) === "b") {
          polygon01.addPoint(1, 1).addPoint(1 - up, 1);
          if (up * down === 0) {
            polygon01.addPoint(1, 1 - side);
          } else {
            polygon01.addPoint(1 - down, 0).addPoint(1, 0);
          }
        } else {
          polygon01.addPoint(1 - up, 0).addPoint(1, 0);
          if (up * down === 0) {
            polygon01.addPoint(1, side);
          } else {
            polygon01.addPoint(1, 1).addPoint(1 - down, 1);
          }
        }
      } else {
        if (type.charAt(1) === "b") {
          polygon01.addPoint(up, 1).addPoint(0, 1);
          if (up * down === 0) {
            polygon01.addPoint(0, 1 - side);
          } else {
            polygon01.addPoint(0, 0).addPoint(down, 0);
          }
        } else {
          polygon01.addPoint(0, 0).addPoint(up, 0);
          if (up * down === 0) {
            polygon01.addPoint(0, side);
          } else {
            polygon01.addPoint(down, 1).addPoint(0, 1);
          }
        }
      }
      return polygon01.toString();
    }

    function getHideCornerPolygon(up, down, side, type) {
      var polygon01 = new polygon();
      if (type.charAt(0) === "r") {
        if (type.charAt(1) === "b") {
          polygon01
            .addPoint(1 - up, 1)
            .addPoint(0, 1)
            .addPoint(0, 0);
          if (up * down === 0) {
            polygon01.addPoint(1, 0).addPoint(1, 1 - side);
          } else {
            polygon01.addPoint(1 - down, 0);
          }
        } else {
          polygon01
            .addPoint(0, 1)
            .addPoint(0, 0)
            .addPoint(1 - up, 0);
          if (up * down === 0) {
            polygon01.addPoint(1, side).addPoint(1, 1);
          } else {
            polygon01.addPoint(1 - down, 1);
          }
        }
      } else {
        if (type.charAt(1) === "b") {
          polygon01.addPoint(1, 0).addPoint(1, 1).addPoint(up, 1);
          if (up * down === 0) {
            polygon01.addPoint(0, 1 - side).addPoint(0, 0);
          } else {
            polygon01.addPoint(down, 0);
          }
        } else {
          polygon01.addPoint(up, 0).addPoint(1, 0).addPoint(1, 1);
          if (up * down === 0) {
            polygon01.addPoint(0, 1).addPoint(0, side);
          } else {
            polygon01.addPoint(down, 1);
          }
        }
      }
      return polygon01.toString();
    }
    function setCorner(up, down, side, rate, type, x, y, width, height) {
      var r = type.charAt(0) === "r" ? 1 : 0;
      var b = type.charAt(1) === "b" ? 1 : 0;
      back.style.clipPath = back.style.WebkitClipPath = getCornerPolygon(up, down, side, type);
      corner.style.clipPath = corner.style.WebkitClipPath = getCornerPolygon(
        up,
        down,
        side,
        (r ? "l" : "r") + type.charAt(1)
      );
      if (type.charAt(0) === "r") {
        bottomPage_left.style.clipPath = bottomPage_left.style.WebkitClipPath = "";
        bottomPage_right.style.clipPath = bottomPage_right.style.WebkitClipPath = getHideCornerPolygon(
          up,
          down,
          side,
          type
        );
      } else {
        bottomPage_left.style.clipPath = bottomPage_left.style.WebkitClipPath = getHideCornerPolygon(
          up,
          down,
          side,
          type
        );
        bottomPage_right.style.clipPath = bottomPage_right.style.WebkitClipPath = "";
      }
      var angle = Math.atan2(y, rate * (x - up)) / PI180;
      var Transform01 = new transform();
      Transform01.addTranslateX(r);
      back.style.transform = Transform01.toString();
      corner.style.transformOrigin = 100 * r + "% " + 100 * b + "%";
      Transform01.clear();
      var n0 = r ? 1 : -1;
      var n1 = b ? 1 : -1;
      Transform01.addTranslateX(n0 * (r - up))
        .addRotate(n0 * n1 * angle)
        .addTranslateX(n0 * (1 - up));
      corner.style.transform = Transform01.toString();

      //shadow
      var side01 = up * down === 0 ? side : 1;
      var nn = side01 * 0.25 + easingFunctions.easeInCubic(up) * 0.25 + easingFunctions.easeInQuint(down) * 0.5;
      var vv = new vector2D((up - down) * rate, side01);
      vv.normalize();
      vv.scale(nn * (width + 0));

      if (up === 0) {
        corner_shadow01_color.setLine(0, 0, 0, 0);
      } else {
        if (type.charAt(0) === "r") {
          if (type.charAt(1) === "b") {
            corner_shadow01_color.setLine((2 - up) * width, height, (2 - up) * width - vv.y, height - vv.x);
          } else {
            corner_shadow01_color.setLine((2 - up) * width, 0, (2 - up) * width - vv.y, vv.x);
          }
        } else {
          if (type.charAt(1) === "b") {
            corner_shadow01_color.setLine(up * width, height, up * width + vv.y, height - vv.x);
          } else {
            corner_shadow01_color.setLine(up * width, 0, up * width + vv.y, vv.x);
          }
        }
      }

      var c0 = 0;
      var c1 = nn * 0.3;
      var c2 = 0; //nn * 0.1 * (up * down === 0 ? 0 : easingFunctions.easeInExpo(down));

      var corner_shadow01_color_children = corner_shadow01_color.children;
      corner_shadow01_color_children[0].style.stopColor = "rgba(0, 0, 0, " + c0 + ")";
      corner_shadow01_color_children[1].style.stopColor = "rgba(0, 0, 0, " + c1 + ")";
      corner_shadow01_color_children[2].style.stopColor = "rgba(0, 0, 0, " + c2 + ")";

      var b_nn = side01 * 0.25 + easingFunctions.easeOutCubic(up) * 0.25 + easingFunctions.easeOutQuint(down) * 0.5;
      b_nn = 1 - b_nn;
      var b_vv = new vector2D((up - down) * rate, side01);
      b_vv.normalize();
      b_vv.scale(nn * (width + 0));

      if (up === 0) {
        corner_shadow01_color.setLine(0, 0, 0, 0);
        corner_shadow02_color.setLine(0, 0, 0, 0);
      } else {
        if (type.charAt(0) === "r") {
          if (type.charAt(1) === "b") {
            corner_shadow02_color.setLine((2 - up) * width, height, (2 - up) * width + b_vv.y, height + b_vv.x);
          } else {
            corner_shadow02_color.setLine((2 - up) * width, 0, (2 - up) * width + b_vv.y, -b_vv.x);
          }
        } else {
          if (type.charAt(1) === "b") {
            corner_shadow02_color.setLine(up * width, height, up * width - b_vv.y, height + b_vv.x);
          } else {
            corner_shadow02_color.setLine(up * width, 0, up * width - b_vv.y, -b_vv.x);
          }
        }
      }

      var b_c0 = 0;
      var b_c1 = b_nn * 0.2;
      var b_c2 = 0; //b_nn * 0.1 * (up * down === 0 ? 0 : easingFunctions.easeOutExpo(down));

      var corner_shadow02_color_children = corner_shadow02_color.children;
      corner_shadow02_color_children[0].style.stopColor = "rgba(0, 0, 0, " + b_c0 + ")";
      corner_shadow02_color_children[1].style.stopColor = "rgba(0, 0, 0, " + b_c1 + ")";
      corner_shadow02_color_children[2].style.stopColor = "rgba(0, 0, 0, " + b_c2 + ")";
    }
    function cornerCate(width, height, mp) {
      var pos = new vector2D(mp);
      if (pos.x === 0 && pos.y === 0) {
        return {
          up: 0,
          down: 0,
          side: 0,
        };
      }

      var xy2 = pos.x * pos.x + pos.y * pos.y;
      var w = pos.x * width;
      var h = pos.y * height;

      //var down = (0.5 * (xy2 - 2 * pos.y * height)) / w;
      var up = (0.5 * xy2) / w;
      var down = up - (pos.y * height) / w;
      var side = (0.5 * xy2) / h;
      up = Math.crop(up);
      down = Math.crop(down);
      side = Math.crop(side);
      return {
        up: up,
        down: down,
        side: side,
      };
    }
    function cornerLimit(width, height, mp) {
      var pos = new vector2D(mp);

      //滑鼠在書的中上座標
      var centerTopVector = pos.clone().sub({ x: width });
      var centerTopDistance = centerTopVector.length();

      //滑鼠在書的中下座標
      var centerBottomVector = pos.clone().sub(width, height);
      var centerBottomDistance = centerBottomVector.length();

      var maxLength = new vector2D(width, height).length();
      if (pos.y > 0) {
        if (centerTopDistance > width) {
          //滑鼠超過在書的中上座標極限做限制
          pos
            .set(centerTopVector)
            .scale(width / centerTopDistance)
            .add({ x: width });
        }
      } else {
        if (centerBottomVector.x / centerBottomVector.y >= width / height) {
          //滑鼠在書的中下座標的斜率對比書本斜率做限制
          pos.set(0, 0);
        } else if (centerBottomDistance > maxLength) {
          //滑鼠超過在書的中下座標極限做限制
          pos
            .set(centerBottomVector)
            .scale(maxLength / centerBottomDistance)
            .add(width, height);
        }
      }
      return pos;
    }
    function cornerChange(width, height, mp, type) {
      var pos = new vector2D(mp);
      if (type.charAt(0) === "r") {
        pos.x = width * 2 - pos.x;
      }
      if (type.charAt(1) === "b") {
        pos.y = height - pos.y;
      }
      return pos;
    }
    function setCornerPos(width, height, pos, type) {
      var pp = cornerChange(width, height, pos, type);
      pp = cornerLimit(width, height, pp);
      var temp = cornerCate(width, height, pp);
      setCorner(temp.up, temp.down, temp.side, rate, type, pp.x / width, pp.y / height, width, height);
      return pp;
    }
    var mpOld = new vector2D(0, 0);
    var mp = new vector2D(0, 0);
    var cornerPos = new vector2D(0, 0);
    var fourCornerPos = {
      lt: new vector2D(0, 0),
      rt: new vector2D(2 * width, 0),
      lb: new vector2D(0, height),
      rb: new vector2D(2 * width, height),
    };
    var fourCornerBool = {
      lt: true,
      rt: true,
      lb: true,
      rb: true,
    };
    var type = "lt";
    var pageNum = -1; /* + 2*/
    setCornerPos(width, height, cornerPos, type);
    setBottomPage(pageNum);
    setCornerContent(pageNum, type);
    setCornerActive(pageNum);
    var opening = false;
    var cornering = false;
    var animationing = false;
    var changeing = false;
    var moveX = 0;

    function TouchesPoint(pTouches) {
      var p = new Array();
      var c = new vector2D();
      var d = 0;
      if (pTouches) {
        var len = pTouches.length;
        for (var i = 0; i < len; i++) {
          p[i] = new vector2D(pTouches[i].pageX, pTouches[i].pageY);
          c.add(p[i]);
        }
        c.scale(1 / len);
        if (len == 2) {
          d = p[1].sub(p[0]).len();
        }
      }
      return {
        pos: c,
        dis: d,
      };
    }

    book.addEventListener("mousedown", function (e) {
      start();
    });
    window.addEventListener("mouseup", function (e) {
      end();
    });
    window.addEventListener("mousemove", function (e) {
      move(new vector2D(e.pageX, e.pageY));
      corneringJudge();
    });

    book.addEventListener("touchstart", function (e) {
      var TP = TouchesPoint(e.touches);
      setMp(TP.pos);
      mpOld.set(mp);
      corneringJudge();
      start();
      if (opening) {
        e.preventDefault();
        //e.stopPropagation();
      }
    });
    book.addEventListener("touchend", function (e) {
      end();
    });
    book.addEventListener("touchmove", function (e) {
      var TP = TouchesPoint(e.touches);
      move(TP.pos);
      if (opening) {
        e.preventDefault();
        //e.stopPropagation();
      }
    });
    /*document.body.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();
      },
      { passive: false }
    );*/
    function setMp(pos) {
      mpOld.set(mp);
      var contentPos = getPos(content);
      mp.set(pos.x - contentPos.left, pos.y - contentPos.top);
    }
    function start() {
      if (!opening && cornering && !animationing) {
        opening = true;
        animationing = false;
      }
    }
    function end() {
      if (opening) {
        opening = false;
        animationing = true;
        if (Math.abs(moveX) >= 2) {
          if (type.charAt(0) === "r") {
            changeing = moveX <= -2;
          } else {
            changeing = moveX >= 2;
          }
        } else {
          if (type.charAt(0) === "r") {
            changeing = mp.x < width;
          } else {
            changeing = mp.x > width;
          }
        }
      }
    }
    function move(pos) {
      /*var contentPos = getPos(content);
      mp.set(e.pageX - contentPos.left, e.pageY - contentPos.top);
      moveX = e.movementX;*/
      setMp(pos);
      moveX = mp.clone().sub(mpOld).x;
    }

    function corneringJudge() {
      if (!opening && !animationing) {
        if (mp.x >= 0 && mp.x <= width * 2 && mp.y >= 0 && mp.y <= height) {
          var bool = false;
          for (var key in fourCornerPos) {
            if (fourCornerBool[key]) {
              var obj = fourCornerPos[key];
              var length = obj.clone().sub(mp).length();
              if (length <= 100) {
                if (type !== key) {
                  type = key;
                  cornerPos.set(obj);
                  setCornerContent(pageNum, type);
                  setCornerActive(pageNum);
                }
                animationing = false;
                bool = true;
                break;
              }
            }
          }
          if (cornering !== bool) {
            cornering = bool;
            if (!cornering) {
              animationing = true;
            }
          }
        } else {
          if (cornering) {
            cornering = false;
            animationing = true;
          }
        }
      }
    }

    buttonPrev.addEventListener("click", function (e) {
      var type01 = "lt";
      if (!animationing && fourCornerBool[type01]) {
        if (type !== type01) {
          type = type01;
          var obj = fourCornerPos[type];
          cornerPos.set(obj);
          setCornerContent(pageNum, type);
        }
        changeing = true;
        animationing = true;
      }
    });
    buttonNext.addEventListener("click", function (e) {
      var type01 = "rt";
      if (!animationing && fourCornerBool[type01]) {
        if (type !== type01) {
          type = type01;
          var obj = fourCornerPos[type];
          cornerPos.set(obj);
          setCornerContent(pageNum, type);
        }
        changeing = true;
        animationing = true;
      }
    });
    function setCornerActive(n) {
      fourCornerBool.lt = fourCornerBool.lb = n >= 0;
      fourCornerBool.rt = fourCornerBool.rb = n < pagesChildren.length - 1;
    }
    function setCornerContent(n, type) {
      var list = back_item.children;
      for (var i = 0; i < list.length; i++) {
        back_item.removeChild(list[i]);
      }
      var list = corner_item.children;
      for (var i = 0; i < list.length; i++) {
        corner_item.removeChild(list[i]);
      }
      var backEl, cornerEl;
      if (type.charAt(0) === "r") {
        backEl = pagesList[n + 3];
        cornerEl = pagesList[n + 2];
      } else {
        backEl = pagesList[n - 2];
        cornerEl = pagesList[n - 1];
      }
      if (backEl) {
        back_item.appendChild(backEl);
        back.style.display = "";
      } else {
        back.style.display = "none";
      }
      if (cornerEl) {
        corner_item.appendChild(cornerEl);
        corner.style.display = "";
      } else {
        corner.style.display = "none";
      }
    }

    function setBottomPage(n) {
      var bottomLeftEl, bottomRightEl;
      var list = bottomPage_left_item.children;
      for (var i = 0; i < list.length; i++) {
        bottomPage_left_item.removeChild(list[i]);
      }
      var list = bottomPage_right_item.children;
      for (var i = 0; i < list.length; i++) {
        bottomPage_right_item.removeChild(list[i]);
      }
      bottomLeftEl = pagesList[n];
      bottomRightEl = pagesList[n + 1];
      if (bottomLeftEl) {
        bottomPage_left_item.appendChild(bottomLeftEl);
        bottomPage_left.style.display = "";
      } else {
        bottomPage_left.style.display = "none";
      }
      if (bottomRightEl) {
        bottomPage_right_item.appendChild(bottomRightEl);
        bottomPage_right.style.display = "";
      } else {
        bottomPage_right.style.display = "none";
      }
    }
    function run() {
      window.requestAnimationFrame(run);

      if (animationing) {
        var type01 = changeing ? (type.charAt(0) === "r" ? "l" : "r") + type.charAt(1) : type;
        cornerPos.add(fourCornerPos[type01].clone().sub(cornerPos).scale(0.2, 0.4));
        setCornerPos(width, height, cornerPos, type);
        var obj = fourCornerPos[type01];
        var length = obj.clone().sub(cornerPos).length();
        if (length <= 1) {
          if (changeing) {
            if (type.charAt(0) === "r") {
              pageNum += 2;
            } else {
              pageNum -= 2;
            }
          }
          animationing = false;
          changeing = false;
          cornering = false;
          cornerPos.set(fourCornerPos[type]);
          setCornerPos(width, height, cornerPos, type);
          setBottomPage(pageNum);
          setCornerContent(pageNum, type);
          setCornerActive(pageNum);
        }
      } else if (opening || cornering) {
        cornerPos.add(mp.clone().sub(cornerPos).scale(0.3));
        setCornerPos(width, height, cornerPos, type);
      }
    }
    run();
  });
})();
