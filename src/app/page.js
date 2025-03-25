"use client";
import { useState, useRef, useMemo } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Center,
} from "@mantine/core";


import { useClipboard } from "@mantine/hooks";
import ContentEditable from "react-contenteditable";
import GraphemeSplitter from "grapheme-splitter";

const ANSI_COLORS = {
  FG: {
    "#4f545c": "\u001b[31m",
    "#dc322f": "\u001b[32m",
    "#859900": "\u001b[34m",
    "#b58900": "\u001b[35m",
    "#268bd2": "\u001b[37m",
    "#d33682": "\u001b[33m",
    "#2aa198": "\u001b[36m",
    "#ffffff": "\u001b[38;2;255;170;0m",
    '#ffff55': '\u001b[90m',
    '#55ffff': '\u001b[95m',

    
  },
  BG: {
    "#002b36": "\u001b[41m",
    "#cb4b16": "\u001b[42m",
    "#586e75": "\u001b[44m",
    "#657b83": "\u001b[45m",
    "#839496": "\u001b[40m",
    "#6c71c4": "\u001b[43m",
    "#93a1a1": "\u001b[46m",
    '#fdf6e3': '\u001b[48;2;255;170;0m',
    '#ffff55': '\u001b[100m',
    '#55ffff': '\u001b[105m',

  },
  RESET: "\u001b[0m",
};

// Color options for FG and BG
const fgColors = [
  { color: "#4f545c", label: "Dark Grey" },
  { color: "#dc322f", label: "Red" },
  { color: "#859900", label: "Yellowish Green" },
  { color: "#b58900", label: "Gold" },
  { color: "#268bd2", label: "Light Blue" },
  { color: "#d33682", label: "Pink" },
  { color: "#2aa198", label: "Teal" },
  { color: "#ffffff", label: "White" },
  { color: '#ffff55', label: 'Yellow' },
  { color: '#55ffff', label: 'Cyan' },

];

const bgColors = [
  { color: "#002b36", label: "Blueish Black" },
  { color: "#cb4b16", label: "Rust Brown" },
  { color: "#586e75", label: "Gray(40%)" },
  { color: "#657b83", label: "Gray(45%)" },
  { color: "#839496", label: "Light Gray(55%)" },
  { color: "#6c71c4", label: "Purple" },
  { color: "#93a1a1", label: "Light Gray(60%)" },
  { color: "#fdf6e3", label: "Cream White" },
  { color: '#ffff55', label: 'Yellow' },
  { color: '#55ffff', label: 'Cyan' },

];

const ColorGrid = ({ colors, type, applyColor, currentColor }) => (
  <div>
    <Text className="text-center mb-6 text-white">{type}</Text>
    <SimpleGrid cols={10} spacing="xs">
      {colors.map((color) => (
        <Button
          key={color.label}
          onClick={() => applyColor(color.color, type)}
          className={`w-10 h-10 border-2 border-border-gray ${
            color.color === currentColor ? "active-color" : ""
          }`}
          style={{ backgroundColor: color.color}}
        />
      ))}
    </SimpleGrid>
  </div>
);

export default function Home() {
  const splitter = new GraphemeSplitter();
  const initial_txt = "Welcome to Rebane's Discord Colored Text Generator!";
  const graphemes = splitter.splitGraphemes(initial_txt); 
  const [text, setText] = useState(initial_txt);
  const [charStyles, setCharStyles] = useState(() => {
    const styles = Array(graphemes.length)
      .fill(null)
      .map(() => ({
        fg: "#ffffff",
        bg: "#1a1b1e",
        bold: false,
        underline: false,
      }));

    for (let i = 0; i <= 6; i++) {
      styles[i].fg = "#ffffff";
    }

    for (let i = 7; i <= 10; i++) {
      styles[i].fg = "#ffffff";
    }

    for (let i = 11; i <= 16; i++) {
      styles[i].fg = "#b58900";
    }

    for (let i = 17; i <= 19; i++) {
      styles[i].fg = "#ffffff";
    }

    for (let i = 20; i <= 26; i++) {
      styles[i].fg = "#ffffff";
      styles[i].bg = '#6c71c4'
    }

    styles[28].fg = "#dc322f";
    styles[29].fg = "#859900";
    styles[30].fg = "#b58900";
    styles[31].fg = "#268bd2";
    styles[32].fg = "#d33682";
    styles[33].fg = "#2aa198";
    styles[34].fg = "#ffffff";

    for (let i = 36; i <= 50; i++) {
      styles[i].fg = "ffffff";
    }

    return styles;
  });
  const [currFgClr, setcurrFgClr] = useState("#ffffff");
  const [currBgClr, setcurrBgClr] = useState("#1a1b1e");
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const contentEditableRef = useRef(null);
  const clipboard = useClipboard({ timeout: 500 });



  const getCharacterOffsets = (range, contentEditableElement) => {
    let startOffset = 0;
    let endOffset = 0;
    let currentOffset = 0;
    let foundStart = false;

    const walkNodes = (node) => {
      if (node === range.startContainer) {
        startOffset = currentOffset + range.startOffset;
        foundStart = true;
      }
      if (node === range.endContainer) {
        endOffset = currentOffset + range.endOffset;
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        currentOffset += node.textContent.length;
      } else {
        for (let child of node.childNodes) {
          if (walkNodes(child)) break;
        }
      }
      return false;
    };

    walkNodes(contentEditableElement.current);
    return { startOffset, endOffset };
  };

  const applyColor = (color, type) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const { startOffset, endOffset } = getCharacterOffsets(
        range,
        contentEditableRef
      );
      if (startOffset !== endOffset) {
        const newCharStyles = [...charStyles];
        for (
          let i = startOffset;
          i < endOffset && i < newCharStyles.length;
          i++
        ) {
          newCharStyles[i] = {
            ...newCharStyles[i],
            [type === "FG" ? "fg" : "bg"]: color,
          };
        }
        setCharStyles(newCharStyles);
      }
    }
    if (type === "FG") setcurrFgClr(color);
    else if (type === "BG") setcurrBgClr(color);
  };

  const applyBold = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const { startOffset, endOffset } = getCharacterOffsets(
        range,
        contentEditableRef
      );
      if (startOffset !== endOffset) {
        const newCharStyles = [...charStyles];
        for (
          let i = startOffset;
          i < endOffset && i < newCharStyles.length;
          i++
        ) {
          newCharStyles[i] = { ...newCharStyles[i], bold: !isBoldActive };
        }
        setCharStyles(newCharStyles);
      }
    }
    const newBoldState = !isBoldActive;
    setIsBoldActive(newBoldState);
    console.log(`Bold button is now ${newBoldState ? "active" : "inactive"}`);
  };

  const applyUnderline = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const { startOffset, endOffset } = getCharacterOffsets(
        range,
        contentEditableRef
      );
      if (startOffset !== endOffset) {
        const newCharStyles = [...charStyles];
        for (
          let i = startOffset;
          i < endOffset && i < newCharStyles.length;
          i++
        ) {
          newCharStyles[i] = {
            ...newCharStyles[i],
            underline: !isUnderlineActive,
          };
        }
        setCharStyles(newCharStyles);
      }
    }
    const newUnderlineState = !isUnderlineActive;
    setIsUnderlineActive(newUnderlineState);
    console.log(
      `Underline button is now ${newUnderlineState ? "active" : "inactive"}`
    );
  };

  const clearFormatting = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const { startOffset, endOffset } = getCharacterOffsets(
        range,
        contentEditableRef
      );
      if (startOffset !== endOffset) {
        const newCharStyles = [...charStyles];
        for (
          let i = startOffset;
          i < endOffset && i < newCharStyles.length;
          i++
        ) {
          newCharStyles[i] = {
            fg: "#ffffff",
            bg: "#1a1b1e",
            bold: false,
            underline: false,
          };
        }
        setCharStyles(newCharStyles);
        updateFormattingState();
      }
    }
    setcurrFgClr("#ffffff");
    setcurrBgClr("#1a1b1e");
    setIsBoldActive(false);
    setIsUnderlineActive(false);
    console.log("Bold button is now inactive due to clearFormatting");
    console.log("Underline button is now inactive due to clearFormatting");
  };

  const handleChange = (evt) => {
    const newText = evt.target.value.replace(/<[^>]+>/g, "") || "";
    const newCharStyles = Array(newText.length).fill(null);

    for (let i = 0; i < newText.length; i++) {
      newCharStyles[i] =
        i < charStyles.length
          ? charStyles[i]
          : {
              fg: currFgClr,
              bg: currBgClr,
              bold: isBoldActive,
              underline: isUnderlineActive,
            };
    }

    setText(newText);
    setCharStyles(newCharStyles);
    updateFormattingState();
  };

  const resetText = () => {
    setText("");
    setCharStyles([]);
    setcurrFgClr("#ffffff");
    setcurrBgClr("#1a1b1e");
    setIsBoldActive(false);
    setIsUnderlineActive(false);
    console.log("Bold button is now inactive due to resetText");
    console.log("Underline button is now inactive due to resetText");
  };

  const updateFormattingState = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const { startOffset, endOffset } = getCharacterOffsets(
        range,
        contentEditableRef
      );
      if (startOffset !== endOffset) {
        const allBold = charStyles
          .slice(startOffset, endOffset)
          .every((style) => style?.bold === true);
        const newBoldState = allBold;
        setIsBoldActive(newBoldState);
        console.log(
          `Bold button updated to ${
            newBoldState ? "active" : "inactive"
          } due to selection`
        );

        const allUnderlined = charStyles
          .slice(startOffset, endOffset)
          .every((style) => style?.underline === true);
        const newUnderlineState = allUnderlined;
        setIsUnderlineActive(newUnderlineState);
        console.log(
          `Underline button updated to ${
            newUnderlineState ? "active" : "inactive"
          } due to selection`
        );
      }
    }
  };

  const copyText = () => {
    let ansiText = "";
    let lastFg = null;
    let lastBg = null;
    let boldActive = false;
    let underlineActive = false;

    for (let i = 0; i < text.length; i++) {
      const { fg, bg, bold, underline } = charStyles[i] || {
        fg: "#ffffff",
        bg: "#1a1b1e",
        bold: false,
        underline: false,
      };

      if (bold && !boldActive) {
        ansiText += "**";
        boldActive = true;
      } else if (!bold && boldActive) {
        ansiText += "**";
        boldActive = false;
      }

      if (underline && !underlineActive) {
        ansiText += "__";
        underlineActive = true;
      } else if (!underline && underlineActive) {
        ansiText += "__";
        underlineActive = false;
      }

      if (fg !== lastFg) {
        if (lastFg !== null) {
          ansiText += ANSI_COLORS.RESET;
          if (boldActive) ansiText += "**";
          if (underlineActive) ansiText += "__";
        }

        if (
          fg !== "#ffffff" ||
          bold ||
          underline ||
          (bg !== "#1a1b1e" && bg !== lastBg)
        ) {
          ansiText += ANSI_COLORS.FG[fg] || "";
        }
        lastFg = fg;
      }

      if (bg !== lastBg) {
        if (lastBg !== null) {
          ansiText += ANSI_COLORS.RESET;
          if (boldActive) ansiText += "**";
          if (underlineActive) ansiText += "__";
        }

        if (bg !== "#1a1b1e") {
          ansiText += ANSI_COLORS.BG[bg] || "";
        }
        lastBg = bg;
      }

      ansiText += text[i];
    }

    if (boldActive) ansiText += "**";
    if (underlineActive) ansiText += "__";
    ansiText += ANSI_COLORS.RESET;

    const discordFormattedText = "```ansi\n" + ansiText;
    clipboard.copy(discordFormattedText);
  };

  const generateStyledHtml = () => {
    if (!text) return "";

    let html = "";
    let currentSpan = {
      fg: null,
      bg: null,
      bold: null,
      underline: null,
      text: "",
    };

    for (let i = 0; i < text.length; i++) {
      const style = charStyles[i] || {
        fg: "#ffffff",
        bg: "#1a1b1e",
        bold: false,
        underline: false,
      };

      if (
        i === 0 ||
        style.fg !== currentSpan.fg ||
        style.bg !== currentSpan.bg ||
        style.bold !== currentSpan.bold ||
        style.underline !== currentSpan.underline
      ) {
        if (currentSpan.text) {
          html += `<span style="color: ${currentSpan.fg}; background-color: ${
            currentSpan.bg
          }; ${currentSpan.bold ? "font-weight: bold;" : ""} ${
            currentSpan.underline ? "text-decoration: underline;" : ""
          }">${currentSpan.text}</span>`;
        }
        currentSpan = {
          fg: style.fg,
          bg: style.bg,
          bold: style.bold,
          underline: style.underline,
          text: text[i],
        };
      } else {
        currentSpan.text += text[i];
      }
    }

    if (currentSpan.text) {
      html += `<span style="color: ${currentSpan.fg}; background-color: ${
        currentSpan.bg
      }; ${currentSpan.bold ? "font-weight: bold;" : ""} ${
        currentSpan.underline ? "text-decoration: underline;" : ""
      }">${currentSpan.text}</span>`;
    }

    return html;
  };

  const renderStyledText = useMemo(() => {
    if (!text || typeof text !== "string")
      return <span className="text-white"> </span>;

    const spans = [];
    let currentSpan = {
      fg: null,
      bg: null,
      bold: null,
      underline: null,
      text: "",
      startIndex: 0,
    };

    for (let i = 0; i < text.length; i++) {
      const style = charStyles[i] || {
        fg: "#ffffff",
        bg: "#1a1b1e",
        bold: false,
        underline: false,
      };

      if (
        i === 0 ||
        style.fg !== currentSpan.fg ||
        style.bg !== currentSpan.bg ||
        style.bold !== currentSpan.bold ||
        style.underline !== currentSpan.underline
      ) {
        if (currentSpan.text) {
          spans.push(
            <span
              key={currentSpan.startIndex}
              style={{
                color: currentSpan.fg,
                backgroundColor: currentSpan.bg,
              }}
              className={`${currentSpan.bold ? "font-bold" : ""} ${
                currentSpan.underline ? "underline" : ""
              }`}
            >
              {currentSpan.text}
            </span>
          );
        }
        currentSpan = {
          fg: style.fg,
          bg: style.bg,
          bold: style.bold,
          underline: style.underline,
          text: text[i],
          startIndex: i,
        };
      } else {
        currentSpan.text += text[i];
      }
    }

    if (currentSpan.text) {
      spans.push(
        <span
          key={currentSpan.startIndex}
          style={{
            color: currentSpan.fg,
            backgroundColor: currentSpan.bg,
          }}
          className={`${currentSpan.bold ? "font-bold" : ""} ${
            currentSpan.underline ? "underline" : ""
          }`}
        >
          {currentSpan.text}
        </span>
      );
    }

    return spans;
  }, [text, charStyles]);

  return (
    <Container className="py-8 bg-dark-bg min-h-screen text-white">
      <Title className="text-center mb-8 text-green-accent text-3xl font-bold">
        Rebane's Discord Colored Text Generator
      </Title>

      <div className="mb-4">
        <Title order={2} className="text-center mb-4 text-white">
          About
        </Title>
        <Text className="text-center text-text-gray leading-relaxed">
          This is a simple app that creates colored Discord messages using the
          ANSI color codes available on the latest Discord desktop versions.
        </Text>
      </div>

      <div className="mb-6">
        <Title order={2} className="text-center mb-6 text-white">
          Create Your Text
        </Title>

        <div className="flex justify-center mb-6">
          <Group position="center" spacing="xs">
            <Button
              onClick={resetText}
              className="border border-red-accent text-red-accent hover:bg-red-accent/20"
            >
              Reset All
            </Button>
            <Button
              onClick={applyBold}
              className={`border border-blue-accent text-blue-accent hover:bg-blue-accent/20 ${
                isBoldActive ? "active-color" : ""
              }`}
            >
              Bold
            </Button>
            <Button
              onClick={applyUnderline}
              className={`border border-blue-accent text-blue-accent hover:bg-blue-accent/20 ${
                isUnderlineActive ? "active-color" : ""
              }`}
            >
              Line
            </Button>
          </Group>
        </div>

            
        <Group position="center" direction="column" className="sm:ml-56 mb-6">
          <ColorGrid
            colors={fgColors}
            type="FG"
            applyColor={applyColor}
            currentColor={currFgClr}
          />
          <ColorGrid
            colors={bgColors}
            type="BG"
            applyColor={applyColor}
            currentColor={currBgClr}
          />
        </Group>

        <div className="mb-6">
          <div className="bg-dark-bg border border-border-gray rounded p-3 min-h-[100px] whitespace-pre-wrap overflow-auto shadow custom-mono">
            <ContentEditable
              innerRef={contentEditableRef}
              html={generateStyledHtml()}
              onChange={handleChange}
              onMouseUp={updateFormattingState}
              onKeyUp={updateFormattingState}
              className="outline-none text-white text-base"
              spellCheck="true"
            />
          </div>
        </div>

        <Center>
          <Button
            onClick={copyText}
            className="bg-blue-accent hover:bg-blue-hover"
          >
            Copy text as Discord formatted
          </Button>
          {clipboard.copied && (
            <Text className="ml-2 text-green-accent">Copied!</Text>
          )}
        </Center>
      </div>

      <Text className="text-center">
        This is an unofficial tool, it is not created or endorsed by Discord.
      </Text>
    </Container>
  );
}
