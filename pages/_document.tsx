import fs from "fs";
import path from "path";
import Document, { Html, Main, NextScript, Head } from "next/document";

interface DocumentFiles {
  sharedFiles: readonly string[];
  pageFiles: readonly string[];
  allFiles: readonly string[];
}

class InlineStylesHead extends Head {
  getCssLinks({ allFiles }: DocumentFiles) {
    return allFiles
      .filter(file => file.endsWith(".css"))
      .map(file => (
        <style
          key={file}
          nonce={this.props.nonce}
          dangerouslySetInnerHTML={{
            __html: fs.readFileSync(path.join(".next", file), "utf-8"),
          }}
        />
      ));
  }
}

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <InlineStylesHead />
        <body id="tonline-top">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
