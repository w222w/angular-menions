import { ComponentFactoryResolver, ElementRef, TemplateRef, ViewContainerRef } from "@angular/core";
import { EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { MentionConfig } from "./mention-config";
/**
 * Angular Mentions.
 * https://github.com/w222w/angular-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
export declare class MentionDirective implements OnChanges {
    private _element;
    private _componentResolver;
    private _viewContainerRef;
    private mentionItems;
    mention: any[];
    mentionConfig: MentionConfig;
    private activeConfig;
    private DEFAULT_CONFIG;
    mentionListTemplate: TemplateRef<any>;
    searchTerm: EventEmitter<string>;
    opened: EventEmitter<{}>;
    closed: EventEmitter<{}>;
    private triggerChars;
    private searchString;
    private startPos;
    private startNode;
    private searchList;
    private searching;
    private iframe;
    private lastKeyCode;
    constructor(_element: ElementRef, _componentResolver: ComponentFactoryResolver, _viewContainerRef: ViewContainerRef);
    ngOnChanges(changes: SimpleChanges): void;
    updateConfig(): void;
    private addConfig;
    setIframe(iframe: HTMLIFrameElement): void;
    stopEvent(event: any): void;
    blurHandler(event: any): void;
    inputHandler(event: any, nativeElement?: HTMLInputElement): void;
    keyHandler(event: any, nativeElement?: HTMLInputElement): boolean;
    startSearch(triggerChar?: string, nativeElement?: HTMLInputElement): void;
    stopSearch(): void;
    updateSearchList(): void;
    showSearchList(nativeElement: HTMLInputElement): void;
}
