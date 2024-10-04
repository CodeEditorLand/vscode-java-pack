// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { Dispatch } from "@reduxjs/toolkit";
import {
	VSCodePanels,
	VSCodePanelTab,
	VSCodePanelView,
} from "@vscode/webview-ui-toolkit/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProjectType } from "../../../../utils/webview";
import {
	listVmInstalls,
	updateActiveTab,
} from "./classpathConfigurationViewSlice";
import Hint from "./components/Hint";
import JdkRuntime from "./components/JdkRuntime";
import Libraries from "./components/Libraries";
import Output from "./components/Output";
import Sources from "./components/Sources";
import UnmanagedFolderSources from "./components/UnmanagedFolderSources";

import "../style.scss";

const ClasspathConfigurationView = (): JSX.Element => {
	const activeTab: string = useSelector(
		(state: any) => state.classpathConfig.ui.activeTab,
	);
	const activeProjectIndex: number = useSelector(
		(state: any) => state.commonConfig.ui.activeProjectIndex,
	);
	const projectType: ProjectType = useSelector(
		(state: any) => state.commonConfig.data.projectType[activeProjectIndex],
	);
	const dispatch: Dispatch<any> = useDispatch();

	const onClickTab = (tabId: string) => {
		dispatch(updateActiveTab(tabId));
	};

	const onMessage = (event: any) => {
		const { data } = event;
		if (data.command === "classpath.onDidListVmInstalls") {
			dispatch(listVmInstalls(data.vmInstalls));
		}
	};

	useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => {
			window.removeEventListener("message", onMessage);
		};
	}, []);

	return (
		<div className="root">
			<VSCodePanels activeid={activeTab} className="setting-panels">
				<VSCodePanelTab
					id="source"
					onClick={() => onClickTab("source")}>
					Sources
				</VSCodePanelTab>
				<VSCodePanelTab id="jdk" onClick={() => onClickTab("jdk")}>
					JDK Runtime
				</VSCodePanelTab>
				<VSCodePanelTab
					id="libraries"
					onClick={() => onClickTab("libraries")}>
					Libraries
				</VSCodePanelTab>
				<VSCodePanelView className="setting-panels-view">
					{[ProjectType.Gradle, ProjectType.Maven].includes(
						projectType,
					) && <Sources />}
					{projectType !== ProjectType.Gradle &&
						projectType !== ProjectType.Maven && (
							<UnmanagedFolderSources />
						)}
					{projectType === ProjectType.UnmanagedFolder && <Output />}
				</VSCodePanelView>
				<VSCodePanelView className="setting-panels-view">
					<JdkRuntime />
				</VSCodePanelView>
				<VSCodePanelView className="setting-panels-view">
					<Libraries />
				</VSCodePanelView>
			</VSCodePanels>
			<Hint />
		</div>
	);
};

export default ClasspathConfigurationView;
