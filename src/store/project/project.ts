import { JsonArray, JsonObject } from '../json';
import * as MobX from 'mobx';
import { PageRef } from './page_ref';
import { Store } from '../store';

/**
 * A project is the grouping unit for pages, and directly located below the styleguide designs
 * (styleguide Alva folder > projects > pages). Each page belongs to exactly one project,
 * and each project belongs to exactly one styleguide.
 * Projects do not contain the page elements directly.
 * Instead, they know what pages exist (page references),
 * and the store can load them from YAML files when required (open page).
 */
export class Project {
	/**
	 * The technical (internal) ID of the project.
	 */
	@MobX.observable private id: string;

	/**
	 * The human-friendly name of the project.
	 */
	@MobX.observable private name: string;

	/**
	 * The page references of the project. Projects do not contain the page elements directly.
	 * Instead, they know what pages exist (page references),
	 * and the store can load them from YAML files when required (open page).
	 */
	@MobX.observable private pages: PageRef[] = [];

	/**
	 * Creates a new project.
	 * @param id The technical (internal) ID of the project.
	 * @param name The human-friendly name of the project.
	 */
	public constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}

	/**
	 * Loads and returns a project from a given JSON object.
	 * @param jsonObject The JSON object to load from.
	 * @return A new project object containing the loaded data.
	 */
	public static fromJsonObject(json: JsonObject, store: Store): Project {
		const project: Project = new Project(json.id as string, json.name as string);

		const pages: PageRef[] = [];
		(json.pages as JsonArray).forEach((pageJson: JsonObject) => {
			pages.push(PageRef.fromJsonObject(pageJson, project));
		});

		return project;
	}

	/**
	 * Returns the technical (internal) ID of the project.
	 * @return The technical (internal) ID of the project.
	 */
	public getId(): string {
		return this.id;
	}

	/**
	 * Returns the human-friendly name of the project.
	 * @return The human-friendly name of the project.
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * The page references of the project. Projects do not contain the page elements directly.
	 * Instead, they know what pages exist (page references),
	 * and the store can load them from YAML files when required (open page).
	 */
	public getPages(): PageRef[] {
		return this.pages;
	}

	/**
	 * Internal method to get the pages as a MobX observable.
	 * Do not use from the UI components.
	 * @return The internal pages representation.
	 */
	public getPagesInternal(): MobX.IObservableArray<PageRef> {
		return this.pages as MobX.IObservableArray<PageRef>;
	}

	/**
	 * Serializes the project into a JSON object for persistence.
	 * @return The JSON object to be persisted.
	 */
	public toJsonObject(): JsonObject {
		const pagesJsonObject: JsonObject[] = [];
		this.pages.forEach(pageRef => {
			pagesJsonObject.push(pageRef.toJsonObject());
		});

		return {
			id: this.id,
			name: this.name,
			pages: pagesJsonObject
		};
	}
}
