import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { BsEraserFill } from "react-icons/bs";
import { colors, sizes } from "./Constants";

function SketchBoard({ onSave }) {
  useEffect(() => {
    let clrs = document.querySelectorAll(".color");
    let sizes = document.querySelectorAll(".size");
    let eraser = document.querySelector(".eraser");
    let canvas = document.getElementById("canvas");
    let saveBtn = document.querySelector(".save");
    let clearBtn = document.querySelector(".clear");
    let customColor = document.getElementById("custom-color");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.fillStyle = "white";

    let prevX = null;
    let prevY = null;

    let draw = false;

    // activating a size from list of sizes
    sizes = handleSize(sizes, ctx);

    // activating a color from list of colors
    clrs = handleColors(clrs, ctx, customColor);

    // custom color picker on change function
    handleCustomColor(customColor, clrs, ctx);

    // eraser button functionality
    handleErase(eraser, clrs, ctx);

    // clear button functionality
    handleClear(clearBtn, ctx, canvas);

    // download button functionality
    handleSave(saveBtn, canvas);

    window.addEventListener("mousedown", (e) => (draw = true));
    window.addEventListener("mouseup", (e) => (draw = false));

    window.addEventListener("mousemove", function (e) {
      if (prevX == null || prevY == null || !draw) {
        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }

      let mouseX = e.clientX;
      let mouseY = e.clientY;
      if (eraser.classList.contains("active")) {
        // Erasing
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)"; // Set the eraser color to fully opaque black
      } else {
        // Drawing
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = clrs.find((c) =>
          c.classList.contains("active")
        ).dataset.color;
      }

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();

      prevX = e.clientX;
      prevY = e.clientY;
    });
  }, []);

  function handleSave(saveBtn, canvas) {
    saveBtn.addEventListener("click", () => {
      let data = canvas.toDataURL("image/png");
      onSave(data);
    });
  }

  function handleClear(clearBtn, ctx, canvas) {
    clearBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  function handleErase(eraser, clrs, ctx) {
    eraser.addEventListener("click", () => {
      clrs.forEach((c) => c.classList.remove("active"));
      eraser.classList.add("active");
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    });
  }

  function handleCustomColor(customColor, clrs, ctx) {
    customColor.addEventListener("input", (e) => {
      clrs.forEach((c) => c.classList.remove("active"));
      ctx.strokeStyle = e.target.value;
    });
  }

  function handleColors(clrs, ctx, customColor) {
    clrs[0].classList.add("active");
    clrs = Array.from(clrs);
    clrs.forEach((color) =>
      color.addEventListener("click", () => {
        clrs.forEach((c) => c.classList.remove("active"));
        ctx.strokeStyle = color.dataset.color;
        customColor.value = color.dataset.color;
        color.classList.add("active");
      })
    );
    return clrs;
  }

  function handleSize(sizes, ctx) {
    sizes[0].classList.add("active");
    sizes = Array.from(sizes);
    sizes.forEach((size) =>
      size.addEventListener("click", () => {
        sizes.forEach((s) => s.classList.remove("active"));
        ctx.lineWidth = size.dataset.size;
        size.classList.add("active");
      })
    );
    return sizes;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        boxShadow: "0px 1px 8px rgb(23 110 222 / 10%) !important",
      }}
    >
      <canvas
        id="canvas"
        style={{ backgroundColor: "white", width: "100%", height: "98vh" }}
      ></canvas>

      <Paper variant="outlined" className="toolbar">
        <Stack direction="row" spacing={1} alignItems="center">
          {colors.map((color) => (
            <div
              key={color}
              className="color"
              data-color={color}
              style={{ backgroundColor: color }}
            ></div>
          ))}
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            className="color-picker"
          >
            <ColorLensOutlinedIcon sx={{ fontSize: "18px" }} />
            <Typography variant="subtitle2">Custom Color :</Typography>
            <input type="color" id="custom-color" name="custom-color" />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {sizes.map((size) => (
            <div
              key={size.width}
              className={`size ${size.size}`}
              data-size={size.width}
            ></div>
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button className="eraser" startIcon={<BsEraserFill />}>
            Erase
          </Button>
          <Button
            className="clear"
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Clear
          </Button>
          <Button className="save" variant="contained" startIcon={<SaveIcon />}>
            Save
          </Button>
        </Stack>
      </Paper>
    </Paper>
  );
}

export default SketchBoard;
