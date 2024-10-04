// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as hljs from "highlight.js";
import * as React from "react";

import "../../../../../../webview-resources/highlight.css";

export function highlight(content: string): JSX.Element {
	const highlighted = hljs.highlight("java", content);
	return (
		<pre className="hljs d-flex flex-grow-1">
			<code
				className="hljs flex-grow-1"
				dangerouslySetInnerHTML={{ __html: highlighted.value }}
			/>
		</pre>
	);
}
