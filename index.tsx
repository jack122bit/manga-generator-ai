/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type, Modality } from '@google/genai';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import GIF from 'gif.js.optimized';

// --- UI ELEMENT REFERENCES ---
const mangaForm = document.getElementById('manga-form') as HTMLFormElement;
const stylePresetSelect = document.getElementById('style-preset-select') as HTMLSelectElement;
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const chapterCountInput = document.getElementById('chapter-count-input') as HTMLInputElement;
const panelsPerChapterInput = document.getElementById('panels-per-chapter-input') as HTMLInputElement;

const generateButton = document.getElementById('generate-button') as HTMLButtonElement;
const startOverButton = document.getElementById('start-over-button') as HTMLButtonElement;
const continueLastButton = document.getElementById('continue-last-button') as HTMLButtonElement;
const loader = document.getElementById('loader') as HTMLDivElement;
const loaderMessage = document.getElementById('loader-message') as HTMLParagraphElement;
const loaderSubMessage = document.getElementById('loader-sub-message') as HTMLParagraphElement;
const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
const mangaContainer = document.getElementById('manga-container') as HTMLElement;
const postGenerationActions = document.getElementById('post-generation-actions') as HTMLDivElement;
const pdfExportDropdown = document.getElementById('pdf-export-dropdown') as HTMLDivElement;
const downloadButton = document.getElementById('download-button') as HTMLButtonElement;
const pdfExportOptions = document.getElementById('pdf-export-options') as HTMLDivElement;
const exportImagesButton = document.getElementById('export-images-button') as HTMLButtonElement;
const exportGifButton = document.getElementById('export-gif-button') as HTMLButtonElement;
const continueStoryButton = document.getElementById('continue-story-button') as HTMLButtonElement;
const viewCharacterSheetButton = document.getElementById('view-character-sheet-button') as HTMLButtonElement;


// Storyboard UI Elements
const storyboardContainer = document.getElementById('storyboard-container') as HTMLElement;
const storyboardGrid = document.getElementById('storyboard-grid') as HTMLDivElement;
const generateImagesButton = document.getElementById('generate-images-button') as HTMLButtonElement;
const viewStoryboardCharacterSheetButton = document.getElementById('view-storyboard-character-sheet-button') as HTMLButtonElement;
const storyboardEditModal = document.getElementById('storyboard-edit-modal') as HTMLDivElement;
const storyboardCloseModalButton = document.getElementById('storyboard-close-modal-button') as HTMLButtonElement;
const storyboardDescriptionInput = document.getElementById('storyboard-description-input') as HTMLTextAreaElement;
const storyboardSaveButton = document.getElementById('storyboard-save-button') as HTMLButtonElement;
const storyboardCancelButton = document.getElementById('storyboard-cancel-button') as HTMLButtonElement;


// Reader Mode UI Elements
const readerView = document.getElementById('reader-view') as HTMLDivElement;
const readerChapterTitle = document.getElementById('reader-chapter-title') as HTMLHeadingElement;
const readerImageWrapper = document.getElementById('reader-image-wrapper') as HTMLDivElement;
const readerImage = document.getElementById('reader-image') as HTMLImageElement;
const overlayContainer = document.getElementById('reader-image-overlay-container') as HTMLDivElement;
const readerCaption = document.getElementById('reader-caption') as HTMLParagraphElement;
const readerPageIndicator = document.getElementById('reader-page-indicator') as HTMLSpanElement;
const readerThumbnailContainer = document.getElementById('reader-thumbnail-container') as HTMLDivElement;
const prevButton = document.getElementById('prev-button') as HTMLButtonElement;
const nextButton = document.getElementById('next-button') as HTMLButtonElement;
const prevChapterButton = document.getElementById('prev-chapter-button') as HTMLButtonElement;
const nextChapterButton = document.getElementById('next-chapter-button') as HTMLButtonElement;
const shareButton = document.getElementById('share-button') as HTMLButtonElement;
const closeReaderButton = document.getElementById('close-reader-button') as HTMLButtonElement;
const readerAudio = document.getElementById('reader-audio') as HTMLAudioElement;
const sfxAudio = document.getElementById('sfx-audio') as HTMLAudioElement;
const musicToggleButton = document.getElementById('music-toggle-button') as HTMLButtonElement;
const sfxToggleButton = document.getElementById('sfx-toggle-button') as HTMLButtonElement;
const narrationToggleButton = document.getElementById('narration-toggle-button') as HTMLButtonElement;
const shareNotification = document.getElementById('share-notification') as HTMLDivElement;
const playPauseButton = document.getElementById('play-pause-button') as HTMLButtonElement;
const speedSelect = document.getElementById('speed-select') as HTMLSelectElement;
const voiceSelect = document.getElementById('voice-select') as HTMLSelectElement;
const musicVolumeSlider = document.getElementById('music-volume-slider') as HTMLInputElement;
const sfxVolumeSlider = document.getElementById('sfx-volume-slider') as HTMLInputElement;
const regenerateImageButton = document.getElementById('regenerate-image-button') as HTMLButtonElement;
const editDialogueButton = document.getElementById('edit-dialogue-button') as HTMLButtonElement;
const readerCaptionContainer = document.querySelector('.reader-caption-container') as HTMLDivElement;
const deletePanelButton = document.getElementById('delete-panel-button') as HTMLButtonElement;
const dialogueEditOverlay = document.getElementById('dialogue-edit-overlay') as HTMLDivElement;
const dialogueEditTextarea = document.getElementById('dialogue-edit-textarea') as HTMLTextAreaElement;
const dialogueSaveButton = document.getElementById('dialogue-save-button') as HTMLButtonElement;
const dialogueCancelButton = document.getElementById('dialogue-cancel-button') as HTMLButtonElement;
const readerSearchInput = document.getElementById('reader-search-input') as HTMLInputElement;
const readerFilterToggles = document.getElementById('reader-filter-toggles') as HTMLDivElement;
const readerClearFilterButton = document.getElementById('reader-clear-filter-button') as HTMLButtonElement;
const linkPanelButton = document.getElementById('link-panel-button') as HTMLButtonElement;
const panelLinkIndicator = document.getElementById('panel-link-indicator') as HTMLDivElement;


// Filter and Text Overlay UI Elements
const filterButton = document.getElementById('filter-button') as HTMLButtonElement;
const addTextButton = document.getElementById('add-text-button') as HTMLButtonElement;
const filterOptions = document.getElementById('filter-options') as HTMLDivElement;
const blurSlider = document.getElementById('blur-slider') as HTMLInputElement;
const blurValue = document.getElementById('blur-value') as HTMLSpanElement;
const grayscaleSlider = document.getElementById('grayscale-slider') as HTMLInputElement;
const grayscaleValue = document.getElementById('grayscale-value') as HTMLSpanElement;
const sepiaSlider = document.getElementById('sepia-slider') as HTMLInputElement;
const sepiaValue = document.getElementById('sepia-value') as HTMLSpanElement;
const invertSlider = document.getElementById('invert-slider') as HTMLInputElement;
const invertValue = document.getElementById('invert-value') as HTMLSpanElement;
const sketchSlider = document.getElementById('sketch-slider') as HTMLInputElement;
const sketchValue = document.getElementById('sketch-value') as HTMLSpanElement;
const filterIntensitySliders = document.querySelectorAll<HTMLInputElement>('.filter-intensity-slider');
const clearAllFiltersButton = document.getElementById('clear-all-filters-button') as HTMLButtonElement;


// Layer & Text Editor UI Elements
const textOverlayEditor = document.getElementById('text-overlay-editor') as HTMLDivElement;
const textLayerControls = document.getElementById('text-layer-controls') as HTMLDivElement;
const drawingLayerControls = document.getElementById('drawing-layer-controls') as HTMLDivElement;
const drawingLayerOpacity = document.getElementById('drawing-layer-opacity') as HTMLInputElement;
const textOverlayInput = document.getElementById('text-overlay-input') as HTMLTextAreaElement;
const textOverlaySize = document.getElementById('text-overlay-size') as HTMLInputElement;
const textOverlayColor = document.getElementById('text-overlay-color') as HTMLInputElement;
const textOverlayOutlineWidth = document.getElementById('text-overlay-outline-width') as HTMLInputElement;
const textOverlayOutlineColor = document.getElementById('text-overlay-outline-color') as HTMLInputElement;
const textOverlayFont = document.getElementById('text-overlay-font') as HTMLSelectElement;
const alignmentControls = document.querySelector('.alignment-controls') as HTMLDivElement;
const textOverlayCloseButton = document.getElementById('text-overlay-close-button') as HTMLButtonElement;
const textOverlayDeleteButton = document.getElementById('text-overlay-delete-button') as HTMLButtonElement;
const textOverlayShadowColor = document.getElementById('text-overlay-shadow-color') as HTMLInputElement;
const textOverlayShadowX = document.getElementById('text-overlay-shadow-x') as HTMLInputElement;
const textOverlayShadowY = document.getElementById('text-overlay-shadow-y') as HTMLInputElement;
const textOverlayShadowBlur = document.getElementById('text-overlay-shadow-blur') as HTMLInputElement;
const textOverlayLineHeight = document.getElementById('text-overlay-line-height') as HTMLInputElement;
const textOverlayLetterSpacing = document.getElementById('text-overlay-letter-spacing') as HTMLInputElement;
const textOverlayOpacity = document.getElementById('text-overlay-opacity') as HTMLInputElement;
const textDecorationControls = document.querySelector('.text-style-controls [data-decoration]')?.parentElement as HTMLDivElement;
const textOverlayLayerList = document.getElementById('text-overlay-layer-list') as HTMLUListElement;

// Image Editor UI Elements
const editImageButton = document.getElementById('edit-image-button') as HTMLButtonElement;
const editCanvas = document.getElementById('edit-canvas') as HTMLCanvasElement;
const selectionCanvas = document.getElementById('selection-canvas') as HTMLCanvasElement;
const imageEditToolbar = document.getElementById('image-edit-toolbar') as HTMLDivElement;
// Correctly type querySelectorAll results to avoid casting later.
const brushColorInputs = document.querySelectorAll<HTMLElement>('.brush-color-input');
const brushSizeSlider = document.getElementById('brush-size') as HTMLInputElement;
const eraserToggleButton = document.getElementById('eraser-toggle-button') as HTMLButtonElement;
const genFillButton = document.getElementById('gen-fill-button') as HTMLButtonElement;
const editSaveButton = document.getElementById('edit-save-button') as HTMLButtonElement;
const editCancelButton = document.getElementById('edit-cancel-button') as HTMLButtonElement;
const undoButton = document.getElementById('undo-button') as HTMLButtonElement;
const redoButton = document.getElementById('redo-button') as HTMLButtonElement;
// Correctly type querySelectorAll results to avoid casting later and ensure `disabled` property is available.
const brushShapeButtons = document.querySelectorAll<HTMLButtonElement>('.brush-shape-button');
const blendModeSelect = document.getElementById('blend-mode-select') as HTMLSelectElement;


// Regeneration Modal UI Elements
const regenerationModal = document.getElementById('regeneration-modal') as HTMLDivElement;
const closeModalButton = document.getElementById('close-modal-button') as HTMLButtonElement;
const modalDescriptionInput = document.getElementById('modal-description-input') as HTMLTextAreaElement;
const modalRegenerateButton = document.getElementById('modal-regenerate-button') as HTMLButtonElement;
const modalCancelButton = document.getElementById('modal-cancel-button') as HTMLButtonElement;
const modalLoader = document.getElementById('modal-loader') as HTMLDivElement;
const modalError = document.getElementById('modal-error') as HTMLParagraphElement;

// Generative Fill Modal UI Elements
const genFillModal = document.getElementById('gen-fill-modal') as HTMLDivElement;
const closeGenFillModalButton = document.getElementById('close-gen-fill-modal-button') as HTMLButtonElement;
const genFillPromptInput = document.getElementById('gen-fill-prompt-input') as HTMLTextAreaElement;
const genFillLoader = document.getElementById('gen-fill-loader') as HTMLDivElement;
const genFillError = document.getElementById('gen-fill-error') as HTMLParagraphElement;
const genFillGenerateButton = document.getElementById('gen-fill-generate-button') as HTMLButtonElement;
const genFillCancelButton = document.getElementById('gen-fill-cancel-button') as HTMLButtonElement;

// Character Sheet Modal UI Elements
const characterSheetModal = document.getElementById('character-sheet-modal') as HTMLDivElement;
const characterSheetCloseButton = document.getElementById('character-sheet-close-button') as HTMLButtonElement;
const characterList = document.getElementById('character-list') as HTMLUListElement;
const characterArtContainer = document.getElementById('character-art-container') as HTMLDivElement;
const characterArtImage = document.getElementById('character-art-image') as HTMLImageElement;
const characterArtPlaceholder = document.getElementById('character-art-placeholder') as HTMLDivElement;
const characterArtLoader = document.getElementById('character-art-loader') as HTMLDivElement;
const generateCharacterArtButton = document.getElementById('generate-character-art-button') as HTMLButtonElement;
const editCharacterArtButton = document.getElementById('edit-character-art-button') as HTMLButtonElement;
const characterNameInput = document.getElementById('character-name-input') as HTMLInputElement;
const characterDescriptionTextarea = document.getElementById('character-description-textarea') as HTMLTextAreaElement;
const saveCharacterChangesButton = document.getElementById('save-character-changes-button') as HTMLButtonElement;

// Story Continuation Modal UI Elements
const continueStoryModal = document.getElementById('continue-story-modal') as HTMLDivElement;
const continueCancelButton = document.getElementById('continue-cancel-button') as HTMLButtonElement;
const continuePromptInput = document.getElementById('continue-prompt-input') as HTMLTextAreaElement;
const continueChapterCountInput = document.getElementById('continue-chapter-count-input') as HTMLInputElement;
const continuePanelsPerChapterInput = document.getElementById('continue-panels-per-chapter-input') as HTMLInputElement;
const continueLoader = document.getElementById('continue-loader') as HTMLDivElement;
const continueError = document.getElementById('continue-error') as HTMLParagraphElement;
const continueGenerateButton = document.getElementById('continue-generate-button') as HTMLButtonElement;


// --- GEMINI API SETUP ---
// NOTE: process.env.API_KEY is automatically populated by the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- TYPE DEFINITIONS ---
type FilterType = 'none'; // 'sketch' is now handled by intensity
type BrushShape = 'round' | 'square' | 'spray' | 'star' | 'triangle';

interface TextOverlay {
    id: string;
    text: string;
    color: string;
    fontSize: number;
    x: number; // position in %
    y: number; // position in %
    outlineWidth: number;
    outlineColor: string;
    textAlign: 'left' | 'center' | 'right';
    fontFamily: string;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    opacity: number;
    lineHeight: number; // e.g., 1.2
    letterSpacing: number; // in px
    textDecoration: 'none' | 'underline' | 'line-through';
    visible: boolean;
}

interface MangaPanelStory {
    panel: number;
    description: string;
    dialogue: string;
}

interface Character {
    name: string;
    description: string;
    artSrc?: string;
}

interface Chapter {
    title: string;
    panels: MangaPanelStory[];
}

interface MangaStory {
    styleGuide: string;
    characterSheet: Character[];
    chapters: Chapter[];
    originalPrompt: string;
}

interface PanelCacheItem {
    id: string; // Unique ID for drag-and-drop
    imageSrc: string;
    panelData: MangaPanelStory;
    isPlaceholder: boolean;
    filter: FilterType;
    blur: number; // Blur radius in pixels
    textOverlays: TextOverlay[];
    customNextPanelIndex?: number;
    error?: string;
    filterIntensities: {
        grayscale: number;
        sepia: number;
        invert: number;
        sketch: number;
    };
    brushSettings?: typeof currentBrushSettings;
    editHistory?: ImageData[];
    editHistoryIndex?: number;
    layerOrder: string[]; // IDs of layers, e.g., ['drawing-layer', 'text-123']
    drawingLayerOpacity: number;
    drawingLayerVisible: boolean;
}

interface ChapterCacheItem {
    id: string; // Unique ID for drag-and-drop
    title: string;
    panelCache: PanelCacheItem[];
}

interface UserSettings {
    narrationSpeed: number;
    isMusicMuted: boolean;
    isSfxMuted: boolean;
    isNarrationEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
    narrationVoiceName: string | null;
}

// --- STATE MANAGEMENT ---
let currentGlobalPanelIndex = -1;
let mangaCache: ChapterCacheItem[] = [];
let navigationTimeout: number | undefined;
let notificationTimeout: number | undefined;
let currentStoryData: MangaStory | null = null;
const LOCAL_STORAGE_KEY = 'aiMangaLastStory';
const SETTINGS_STORAGE_KEY = 'aiMangaUserSettings';
let autosaveIntervalId: number | undefined;


// User Settings with default values
let userSettings: UserSettings = {
    narrationSpeed: 1,
    isMusicMuted: false,
    isSfxMuted: false,
    isNarrationEnabled: false,
    musicVolume: 0.3,
    sfxVolume: 0.5,
    narrationVoiceName: null,
};

// Zoom and Pan State
let isZoomed = false;
let isPanning = false;
let hasDragged = false;
let panStartX = 0;
let panStartY = 0;
let panInitialX = 0;
let panInitialY = 0;
let lastTap = 0;

// Auto-advance State
let isAutoPlaying = false;

// Editing State
let isEditingDialogue = false;
let currentlySelectedLayerId: string | null = null;
let draggedTextElement: HTMLElement | null = null;
let textDragOffsetX = 0;
let textDragOffsetY = 0;
let currentlyEditingStoryboardPanel: { chapterIndex: number; panelIndex: number } | null = null;
let currentlyEditingCharacterIndex: number | null = null;
let imageEditContext: { type: 'panel' | 'character', index?: number } | null = null;
let isLinkingPanel = false;
let linkingSourcePanelIndex: number | null = null;
let draggedLayerItem: HTMLElement | null = null;


// Image Editing State
let isImageEditingMode = false;
let isDrawing = false;
const editCanvasCtx = editCanvas.getContext('2d');
const selectionCtx = selectionCanvas.getContext('2d');
let lastX = 0;
let lastY = 0;
let currentBrushSettings = {
    color: '#000000',
    size: 5,
    shape: 'round' as BrushShape,
    blendMode: 'source-over' as GlobalCompositeOperation,
};
let currentEditTool: 'brush' | 'eraser' | 'gen-fill' = 'brush';
let editHistory: ImageData[] = [];
let editHistoryIndex = -1;
let hasDrawnOnMove = false; // Tracks if a mousemove has occurred during a mousedown

// Generative Fill State
let isSelecting = false;
let selectionRect = { x: 0, y: 0, width: 0, height: 0 };
let selectionStartPos = { x: 0, y: 0 };


const stylePresets: Record<string, string> = {
    shonen: "A dynamic, high-energy style typical of popular Shonen Jump manga like Dragon Ball Z or One Piece. Features bold lines, expressive characters with spiky hair or large eyes, dramatic action sequences, heavy use of speed lines, impact effects, and dramatic, angled paneling.",
    seinen: "A gritty, detailed, and mature style reminiscent of manga like Berserk or Vinland Saga. Features heavy cross-hatching, deep shadows, realistic anatomy, intricate backgrounds, and a focus on atmospheric, often grim, environments. The tone is serious and cinematic.",
    shoujo: "A light and airy style often seen in Slice of Life or romance Shoujo manga. Features delicate, thin line art, large expressive eyes with detailed highlights, soft screentone patterns (flowers, sparkles), and a focus on emotional character expressions and idyllic, charming backgrounds.",
    ghibli: "A whimsical, painterly, and nostalgic style inspired by Studio Ghibli films. Features lush, detailed natural backgrounds, rounded character designs with expressive faces, a soft color palette feel (even in black and white), and a strong sense of wonder and tranquility.",
    scifi: "A retro-futuristic style inspired by classic 1980s sci-fi manga like Akira or Ghost in the Shell. Features complex mechanical details (mecha, cyberpunk cities), heavy use of screentones for texture and shading, detailed technical illustrations, and a sense of scale and technological density."
};


// Placeholder for failed image generation
const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
<rect width="512" height="512" fill="#1e1e1e"/>
<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="#b0b0b0">
Image Generation Failed
</text>
</svg>`;
const placeholderImageSrc = `data:image/svg+xml;base64,${btoa(placeholderSvg)}`;


// --- USER SETTINGS PERSISTENCE ---

/** Saves user settings to local storage. */
function saveUserSettings() {
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(userSettings));
    } catch (e) {
        console.error("Failed to save user settings:", e);
    }
}

/** Loads user settings from local storage and applies them to the UI. */
function loadUserSettings() {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
        try {
            const loaded = JSON.parse(savedSettings);
            // Merge with defaults to ensure we have all keys for forward compatibility
            userSettings = { ...userSettings, ...loaded };
        } catch (e) {
            console.error("Failed to parse user settings:", e);
        }
    }
    
    // Apply settings to the UI
    speedSelect.value = userSettings.narrationSpeed.toString();
    // Voice will be set after list is populated
    musicVolumeSlider.value = userSettings.musicVolume.toString();
    sfxVolumeSlider.value = userSettings.sfxVolume.toString();
    readerAudio.volume = userSettings.musicVolume;
    sfxAudio.volume = userSettings.sfxVolume;
    
    // Update music button and audio state
    if (userSettings.isMusicMuted) {
        readerAudio.pause();
        musicToggleButton.innerHTML = '🎵<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-3px, -2px);">/</span>';
    } else {
        musicToggleButton.innerHTML = '🎵';
    }

    // Update SFX button visual
    sfxToggleButton.innerHTML = userSettings.isSfxMuted 
        ? '🔊<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-2px, -2px);">/</span>' 
        : '🔊';
    
    // Update narration button visual
    narrationToggleButton.innerHTML = userSettings.isNarrationEnabled 
        ? '🗣️' 
        : '🗣️<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-2px, -2px);">/</span>';
}


/**
 * Runs an array of promise-returning functions with a specified concurrency limit.
 * @param promiseFactories An array of functions, each returning a promise.
 * @param concurrency The maximum number of promises to run at once.
 * @param delayBetweenTasks Milliseconds to wait after each task completes.
 */
async function runPromisesWithConcurrency<T>(
  promiseFactories: Array<() => Promise<T>>,
  concurrency: number,
  delayBetweenTasks = 0
): Promise<void> {
  const queue = [...promiseFactories];
  
  async function worker(): Promise<void> {
    while (queue.length > 0) {
      // Dequeue safely in a concurrent environment
      const factory = queue.shift();
      if (factory) {
        await factory();
        // Add a delay after a task is completed, if specified and there are more tasks.
        if (delayBetweenTasks > 0 && queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenTasks));
        }
      }
    }
  }

  const workers = Array(concurrency).fill(null).map(worker);
  await Promise.all(workers);
}

/**
 * Sets the loading state of the UI.
 * @param isLoading Whether the app is in a loading state.
 * @param message The message to display in the loader.
 */
function setLoading(isLoading: boolean, message = '') {
    if (isLoading) {
        loader.classList.remove('hidden');
        loaderMessage.textContent = message;
        // Reset progress on new loading start
        loaderSubMessage.textContent = '';
        progressBar.style.transform = 'scaleX(0)';
        generateButton.disabled = true;
        continueLastButton.disabled = true;
    } else {
        loader.classList.add('hidden');
        generateButton.disabled = false;
        continueLastButton.disabled = false;
    }
}

/**
 * Updates the loader with granular progress.
 * @param mainMessage The main status message.
 * @param subMessage The detailed sub-message (e.g., "Panel X of Y").
 * @param progress A number between 0 and 1 for the progress bar.
 */
function updateLoaderProgress(mainMessage: string, subMessage: string, progress: number) {
    if (!loader.classList.contains('hidden')) {
        loaderMessage.textContent = mainMessage;
        loaderSubMessage.textContent = subMessage;
        progressBar.style.transform = `scaleX(${progress})`;
    }
}


/**
 * Displays an error message in the manga container.
 * @param message The error message to display.
 */
function displayError(message: string) {
    mangaContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

/** Resets the application to its initial state. */
function resetApp() {
    stopAutosave(); // Stop background saving
    currentStoryData = null;
    mangaCache = [];
    mangaContainer.innerHTML = '';
    
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    postGenerationActions.classList.add('hidden');
    startOverButton.classList.add('hidden');
    continueLastButton.classList.add('hidden');
    storyboardContainer.classList.add('hidden');
    
    promptInput.disabled = false;
    promptInput.value = '';
    stylePresetSelect.disabled = false;
    stylePresetSelect.value = 'custom';
    
    chapterCountInput.value = '3';
    panelsPerChapterInput.value = '4';
    
    generateButton.textContent = 'Generate Manga';
    generateButton.disabled = false;
    
    readerView.classList.add('hidden'); // Also close reader if open
    document.body.classList.remove('reader-active');
    
    checkForSavedStory(); // Re-check to show continue button if other stories exist (unlikely but good practice)
}

/**
 * Generates the story, style guide, and character descriptions for the manga.
 * @param userPrompt The user's initial manga idea.
 * @param chapterCount The number of chapters.
 * @param panelsPerChapter The number of panels per chapter.
 * @returns A promise that resolves to a complete MangaStory object.
 */
async function generateStory(userPrompt: string, chapterCount: number, panelsPerChapter: number): Promise<MangaStory> {
    const selectedStyle = stylePresetSelect.value;
    let styleInstruction: string;

    if (selectedStyle === 'custom' || !stylePresets[selectedStyle]) {
        styleInstruction = `1. **Style Guide:** Create a concise but descriptive art style guide based on the user's prompt. For example: "A gritty, high-contrast seinen manga style with heavy use of black and dramatic shadows, inspired by classic dark fantasy manga."`;
    } else {
        const presetDescription = stylePresets[selectedStyle];
        styleInstruction = `1. **Style Guide:** Use the following art style guide EXCLUSIVELY: "${presetDescription}". The generated 'styleGuide' property in the JSON response must contain exactly this text.`;
    }
    
    const storyPrompt = `Based on the user's idea: "${userPrompt}", create a complete and compelling manga story package structured into chapters.

    ${styleInstruction}
    2. **Character Sheet:** Create a list of the main characters. For each character, provide a name and a detailed visual description (hair, eyes, clothing, distinguishing features). Describe their initial personality and how they might develop or change throughout the story.
    3. **Chapters:** Create ${chapterCount} chapters for the story. For each chapter, provide a short, evocative title.
    4. **Panels:** Within each chapter, create ${panelsPerChapter} panels. The story must flow logically across chapters, with a clear narrative arc, character development, and at least one significant plot twist. The panel descriptions must be highly detailed and evocative for the image generation model. This is critical. For each panel, clearly outline:
        - **Character Poses:** Describe how each character is standing, sitting, or moving.
        - **Facial Expressions:** Specify the emotions on each character's face.
        - **Background Elements:** Detail the environment.
        - **Dynamic Actions:** Describe any action happening with energy.
    Finally, include a short line of dialogue or narration for each panel.

    Return the result as a single JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: storyPrompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }, // Optimize for speed
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        styleGuide: { type: Type.STRING },
                        characterSheet: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                },
                                required: ['name', 'description'],
                            },
                        },
                        chapters: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    panels: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                panel: { type: Type.NUMBER },
                                                description: { type: Type.STRING },
                                                dialogue: { type: Type.STRING },
                                            },
                                            required: ['panel', 'description', 'dialogue'],
                                        },
                                    },
                                },
                                required: ['title', 'panels'],
                            },
                        },
                    },
                    required: ['styleGuide', 'characterSheet', 'chapters'],
                },
            },
        });

        const story = JSON.parse(response.text);
        if (!story.chapters || !story.characterSheet || !story.styleGuide) {
            throw new Error('The generated story is missing required parts.');
        }
        // Also store the original prompt for context later
        story.originalPrompt = userPrompt;
        return story;
    } catch (error) {
        console.error('Error generating story:', error);
        throw new Error('Failed to generate the manga story. Please try a different prompt.');
    }
}

/**
 * Upscales a base64 image to a higher resolution using a canvas.
 * @param base64Src The source image data URL.
 * @param width The target width.
 * @param height The target height.
 * @returns A promise that resolves to the upscaled image data URL.
 */
async function upscaleImage(base64Src: string, width = 1024, height = 1024): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context for upscaling.'));
            }
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.92)); // High quality JPEG
        };
        img.onerror = () => reject(new Error('Failed to load image for upscaling.'));
        img.src = base64Src;
    });
}


/**
 * Generates a single manga panel image, then upscales it.
 * @param panel The description of the panel to generate.
 * @param storyData The complete story data containing style and character guides.
 * @returns A promise that resolves to the upscaled, base64 encoded image string.
 */
async function generatePanelImage(panel: MangaPanelStory, storyData: MangaStory): Promise<string> {
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const relevantCharacters = storyData.characterSheet.filter(char =>
                panel.description.includes(char.name)
            );
            let characterDescriptions = '';
            if (relevantCharacters.length > 0) {
                characterDescriptions = 'Characters present: ' + relevantCharacters.map(char => `${char.name} (${char.description})`).join('; ');
            }
            
            const imagePrompt = `Manga panel, black and white, professional quality, 1024x1024.
                Art Style: "${storyData.styleGuide}".
                Scene Description: "${panel.description}".
                ${characterDescriptions}
                Focus on: detailed line art, dramatic screentones for shading, dynamic composition, and clear emotional expressions.`;
            
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: '1:1',
                    outputMimeType: 'image/jpeg',
                },
            });

            const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
            if (!imageBytes) {
                throw new Error('Image generation returned no data.');
            }

            // Upscale the generated image
            const initialImageSrc = `data:image/jpeg;base64,${imageBytes}`;
            const upscaledImageSrc = await upscaleImage(initialImageSrc);
            return upscaledImageSrc;

        } catch (error) {
            if (i === MAX_RETRIES - 1) {
                console.error('All retries failed for panel image generation.');
                throw error;
            }
            const delay = (1000 * Math.pow(2, i)) + Math.random() * 1000;
            console.warn(`Attempt ${i + 1} of ${MAX_RETRIES} failed. Retrying in ${Math.round(delay / 1000)}s...`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Image generation failed after all retries.');
}

/**
 * Generates descriptive alt text for a manga panel.
 * @param panelData The story data for the panel.
 */
function getPanelAltText(panelData: MangaPanelStory): string {
    return `Panel ${panelData.panel}: ${panelData.description}. Dialogue: "${panelData.dialogue}"`;
}

/** Renders the entire manga grid with chapters and panels. */
function renderMangaGrid() {
    mangaContainer.innerHTML = '';
    let globalPanelIndex = 0;

    mangaCache.forEach((chapter, chapterIndex) => {
        const chapterGroup = document.createElement('details');
        chapterGroup.className = 'chapter-group';
        chapterGroup.open = true; // Default to open

        const chapterTitle = document.createElement('summary');
        chapterTitle.className = 'chapter-title';
        chapterTitle.textContent = chapter.title;
        chapterGroup.appendChild(chapterTitle);

        const chapterPanels = document.createElement('div');
        chapterPanels.className = 'chapter-panels';
        chapterGroup.appendChild(chapterPanels);

        chapter.panelCache.forEach(item => {
            const panelElement = document.createElement('div');
            panelElement.className = 'manga-panel';
            panelElement.dataset.globalIndex = globalPanelIndex.toString();
            panelElement.addEventListener('click', () => showReader(parseInt(panelElement.dataset.globalIndex!, 10)));

            const img = document.createElement('img');
            img.src = item.imageSrc;
            img.alt = getPanelAltText(item.panelData);
            img.className = 'panel-image';

            const caption = document.createElement('p');
            caption.className = 'panel-caption';
            caption.textContent = `"${item.panelData.dialogue}"`;

            panelElement.appendChild(img);
            panelElement.appendChild(caption);

            if (item.error) {
                panelElement.classList.add('panel-error');
                const retryButton = document.createElement('button');
                retryButton.className = 'retry-button';
                retryButton.textContent = 'Retry';
                retryButton.onclick = (e) => {
                    e.stopPropagation();
                    retryPanelGeneration(parseInt(panelElement.dataset.globalIndex!, 10));
                };
                panelElement.appendChild(retryButton);
            }
            chapterPanels.appendChild(panelElement);
            globalPanelIndex++;
        });
        mangaContainer.appendChild(chapterGroup);
    });
}

/**
 * Handles the main form submission to generate the manga.
 * @param event The form submission event.
 */
async function handleMangaFormSubmit(event: Event) {
    event.preventDefault();
    await generateNewManga();
}

/** Sets up the UI for continuing a story. */
function setupContinueState() {
    promptInput.disabled = true;
    stylePresetSelect.disabled = true;
    
    generateButton.textContent = 'Generate Manga'; // Reset button text
    generateButton.disabled = true; // Disable after first generation

    startOverButton.classList.remove('hidden');
    continueLastButton.classList.add('hidden');
    postGenerationActions.classList.remove('hidden');

    const hasImages = !mangaCache.some(c => c.panelCache.some(p => p.isPlaceholder));
    downloadButton.disabled = !hasImages;
    exportImagesButton.disabled = !hasImages;
    exportGifButton.disabled = !hasImages;
    continueStoryButton.disabled = false;
    viewCharacterSheetButton.disabled = false;
    
    populatePdfExportOptions();
}

/** Handles the initial generation of a new manga story and shows the storyboard. */
async function generateNewManga() {
    const prompt = promptInput.value.trim();
    const chapterCount = parseInt(chapterCountInput.value, 10);
    const panelsPerChapter = parseInt(panelsPerChapterInput.value, 10);

    if (!prompt || isNaN(chapterCount) || isNaN(panelsPerChapter) || chapterCount < 1 || panelsPerChapter < 1) {
        displayError('Please enter a valid prompt, chapter count, and panels per chapter.');
        return;
    }

    resetApp();
    setLoading(true, 'Step 1: Generating manga story...');
    mangaContainer.innerHTML = '';
    continueLastButton.classList.add('hidden');

    try {
        const storyData = await generateStory(prompt, chapterCount, panelsPerChapter);
        currentStoryData = storyData;
        
        mangaForm.classList.add('hidden');
        renderStoryboardView();
        storyboardContainer.classList.remove('hidden');
        startOverButton.classList.remove('hidden');

    } catch (error) {
        if (error instanceof Error) {
            displayError(error.message);
        } else {
            displayError('An unknown error occurred.');
        }
        currentStoryData = null;
    } finally {
        setLoading(false);
    }
}

/** Renders the storyboard editor view from the generated story data. */
function renderStoryboardView() {
    if (!currentStoryData) return;
    storyboardGrid.innerHTML = '';

    currentStoryData.chapters.forEach((chapter, chapterIndex) => {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'storyboard-chapter';

        const title = document.createElement('h3');
        title.className = 'storyboard-chapter-title';
        title.textContent = chapter.title;
        chapterDiv.appendChild(title);

        const panelsGrid = document.createElement('div');
        panelsGrid.className = 'storyboard-panels-grid';

        chapter.panels.forEach((panel, panelIndex) => {
            const panelDiv = document.createElement('div');
            panelDiv.className = 'storyboard-panel';
            panelDiv.id = `storyboard-panel-${chapterIndex}-${panelIndex}`;

            panelDiv.innerHTML = `
                <h4>Panel ${panel.panel}</h4>
                <p><strong>Description:</strong> ${panel.description}</p>
                <p><strong>Dialogue:</strong> "${panel.dialogue}"</p>
            `;
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit Description';
            editButton.dataset.chapterIndex = chapterIndex.toString();
            editButton.dataset.panelIndex = panelIndex.toString();
            editButton.onclick = () => openStoryboardEditModal(chapterIndex, panelIndex);
            panelDiv.appendChild(editButton);
            panelsGrid.appendChild(panelDiv);
        });

        chapterDiv.appendChild(panelsGrid);
        storyboardGrid.appendChild(chapterDiv);
    });
}

/** Starts the image generation process based on the (potentially edited) storyboard. */
async function startImageGenerationFromStoryboard() {
    if (!currentStoryData) {
        displayError("Cannot generate images, no story data found.");
        return;
    }
    
    storyboardContainer.classList.add('hidden');
    mangaForm.classList.remove('hidden'); // Show form again but disabled
    setLoading(true);
    
    let totalPanels = 0;
    
    // Build placeholder cache structure
    mangaCache = currentStoryData.chapters.map((chapter, chapIdx) => {
        totalPanels += chapter.panels.length;
        // Add explicit return type to map callback to ensure correct type inference for `filter`.
        const panelCacheItems = chapter.panels.map((panel, pIdx): PanelCacheItem => ({
            id: `panel-${Date.now()}-${chapIdx}-${pIdx}`,
            imageSrc: placeholderImageSrc,
            panelData: panel,
            isPlaceholder: true,
            filter: 'none',
            blur: 0,
            textOverlays: [],
            filterIntensities: { grayscale: 0, sepia: 0, invert: 0, sketch: 0 },
            layerOrder: ['drawing-layer'],
            drawingLayerOpacity: 1,
            drawingLayerVisible: true,
        }));

        const chapterCacheItem: ChapterCacheItem = {
            id: `chapter-${Date.now()}-${chapIdx}`,
            title: chapter.title,
            panelCache: panelCacheItems
        };
        return chapterCacheItem;
    });

    renderMangaGrid(); // Render placeholders
    
    updateLoaderProgress('Step 2: Generating panel images...', `Panel 0 of ${totalPanels}`, 0.05);

    await generateImagesForChapters(currentStoryData.chapters, 0);
    
    setupContinueState();
    saveStoryToLocalStorage();
    startAutosave();
    setLoading(false);
}

/**
 * Generates panel images for a given set of chapters.
 * @param chaptersToGenerate The chapters to process.
 * @param startingGlobalIndex The global index where these new chapters start.
 */
async function generateImagesForChapters(chaptersToGenerate: Chapter[], startingGlobalIndex: number) {
    if (!currentStoryData) return;

    const totalNewPanels = chaptersToGenerate.reduce((sum, ch) => sum + ch.panels.length, 0);
    const totalPanelsInManga = getTotalPanelCount();
    
    const CONCURRENCY_LIMIT = 1;
    const DELAY_BETWEEN_IMAGES = 2000;
    let panelsGenerated = 0;
    
    const imageGenerationFactories = chaptersToGenerate.flatMap((chapter, chapIdxInNewBlock) => {
        const chapterInfo = mangaCache.find(c => c.title === chapter.title);
        if (!chapterInfo) return [];
        const chapIdxInManga = mangaCache.indexOf(chapterInfo);
        
        return chapter.panels.map((panel, pIdxInChapter) => {
            let currentPanelCounter = 0;
            for(let i=0; i<chapIdxInManga; i++){
                currentPanelCounter += mangaCache[i].panelCache.length;
            }
            const globalIndex = currentPanelCounter + pIdxInChapter;
            
            return async () => {
                try {
                    const imageSrc = await generatePanelImage(panel, currentStoryData!);
                    
                    mangaCache[chapIdxInManga].panelCache[pIdxInChapter].imageSrc = imageSrc;
                    mangaCache[chapIdxInManga].panelCache[pIdxInChapter].isPlaceholder = false;
                    
                    const panelElement = mangaContainer.querySelector(`.manga-panel[data-global-index="${globalIndex}"]`);
                    if (panelElement) {
                        const img = panelElement.querySelector('img');
                        if (img) img.src = imageSrc;
                    }
                } catch (imgError) {
                    console.error(`Failed to generate image for panel ${globalIndex}:`, imgError);
                    mangaCache[chapIdxInManga].panelCache[pIdxInChapter].error = 'Generation failed.';
                    const panelElement = mangaContainer.querySelector(`.manga-panel[data-global-index="${globalIndex}"]`);
                    if (panelElement && !panelElement.classList.contains('panel-error')) {
                         panelElement.classList.add('panel-error');
                         const retryButton = document.createElement('button');
                         retryButton.className = 'retry-button';
                         retryButton.textContent = 'Retry';
                         retryButton.onclick = (e) => {
                             e.stopPropagation();
                             retryPanelGeneration(globalIndex);
                         };
                         panelElement.appendChild(retryButton);
                    }
                } finally {
                    panelsGenerated++;
                    const progress = (panelsGenerated / totalNewPanels);
                    const progressMsg = startingGlobalIndex > 0 ? `Panel ${panelsGenerated} of ${totalNewPanels}` : `Panel ${startingGlobalIndex + panelsGenerated} of ${totalPanelsInManga}`;
                    updateLoaderProgress('Generating panel images...', progressMsg, progress);
                }
            };
        });
    });
    
    await runPromisesWithConcurrency(imageGenerationFactories, CONCURRENCY_LIMIT, DELAY_BETWEEN_IMAGES);
}


/**
 * Handles the user-triggered retry for a single failed panel.
 * @param globalIndex The global index of the panel to retry.
 */
async function retryPanelGeneration(globalIndex: number) {
    const panelElement = mangaContainer.querySelector(`.manga-panel[data-global-index="${globalIndex}"]`) as HTMLElement;
    const panelInfo = getPanelInfoByGlobalIndex(globalIndex);
    if (!panelElement || !currentStoryData || !panelInfo) return;

    panelElement.classList.remove('panel-error');
    panelElement.querySelector('.retry-button')?.remove();
    const spinner = document.createElement('div');
    spinner.className = 'panel-spinner';
    panelElement.appendChild(spinner);

    try {
        const { chapterIndex, panelIndexInChapter: panelIndex, panel } = panelInfo;
        const imageSrc = await generatePanelImage(panel.panelData, currentStoryData);
        
        mangaCache[chapterIndex].panelCache[panelIndex].imageSrc = imageSrc;
        mangaCache[chapterIndex].panelCache[panelIndex].isPlaceholder = false;
        delete mangaCache[chapterIndex].panelCache[panelIndex].error;

        const img = panelElement.querySelector('img');
        if (img) img.src = imageSrc;
        
        saveStoryToLocalStorage();
    } catch (error) {
        console.error(`Retry failed for panel ${globalIndex}:`, error);
        const panelInfoAfterError = getPanelInfoByGlobalIndex(globalIndex);
        if (panelInfoAfterError) {
             mangaCache[panelInfoAfterError.chapterIndex].panelCache[panelInfoAfterError.panelIndexInChapter].error = 'Retry failed.';
        }
        
        panelElement.classList.add('panel-error');
        const retryButton = document.createElement('button');
        retryButton.className = 'retry-button';
        retryButton.textContent = 'Retry';
        retryButton.onclick = (e) => {
            e.stopPropagation();
            retryPanelGeneration(globalIndex);
        };
        panelElement.appendChild(retryButton);
    } finally {
        panelElement.querySelector('.panel-spinner')?.remove();
    }
}


/**
 * Plays a sound effect, respecting the mute setting.
 * @param audio The HTMLAudioElement to play.
 */
function playSound(audio: HTMLAudioElement) {
    if (!userSettings.isSfxMuted) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Audio play failed:", e));
    }
}

// --- LOCAL STORAGE & AUTOSAVE ---

/** Starts the autosave interval. */
function startAutosave() {
    stopAutosave(); // Ensure no multiple intervals are running
    autosaveIntervalId = window.setInterval(() => {
        if (currentStoryData) {
            console.log('Autosaving manga progress...');
            saveStoryToLocalStorage();
        }
    }, 15000); // Save every 15 seconds
}

/** Stops the autosave interval. */
function stopAutosave() {
    if (autosaveIntervalId) {
        clearInterval(autosaveIntervalId);
        autosaveIntervalId = undefined;
    }
}


/** Saves the current story and panel cache to local storage. */
function saveStoryToLocalStorage() {
    if (!currentStoryData || (mangaCache.length === 0 && currentStoryData.characterSheet.length === 0)) return;

    const dataToStore = {
        storyData: currentStoryData,
        mangaCache: mangaCache,
    };
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (e) {
        console.error("Failed to save story to local storage:", e);
    }
}

/** Loads story from local storage and sets up the UI. */
function loadAndSetupLastStory() {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedData) return;
    
    try {
        const { storyData, mangaCache: loadedCache } = JSON.parse(savedData);
        currentStoryData = storyData;
        
        // Normalize loaded character sheet for backward compatibility
        if (currentStoryData && currentStoryData.characterSheet) {
            currentStoryData.characterSheet = currentStoryData.characterSheet.map((c: any) => ({
                artSrc: '',
                ...c,
            }));
        }
        
        // Normalize loaded panel cache for backward compatibility
        mangaCache = loadedCache.map((c: any) => ({
            ...c,
            panelCache: c.panelCache.map((p: any) => ({
                filter: 'none',
                textOverlays: (p.textOverlays || []).map((t: any) => ({
                    opacity: 1,
                    lineHeight: 1.2,
                    letterSpacing: 0,
                    textDecoration: 'none',
                    visible: t.visible ?? true,
                    ...t
                })),
                blur: 0,
                customNextPanelIndex: undefined,
                filterIntensities: { grayscale: 0, sepia: 0, invert: 0, sketch: 0, ...p.filterIntensities },
                layerOrder: p.layerOrder || ['drawing-layer', ...(p.textOverlays || []).map((t: TextOverlay) => t.id)],
                drawingLayerOpacity: p.drawingLayerOpacity ?? 1,
                drawingLayerVisible: p.drawingLayerVisible ?? true,
                ...p,
                error: p.error || undefined,
            })),
        }));

        mangaContainer.innerHTML = '';
        renderMangaGrid();
        setupContinueState();
        startAutosave();
    } catch (e) {
        console.error("Failed to parse saved story data:", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
}

/** Checks if a saved story exists and updates the UI accordingly. */
function checkForSavedStory() {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
        continueLastButton.classList.remove('hidden');
    } else {
        continueLastButton.classList.add('hidden');
    }
}


// --- READER MODE ---

/**
 * Finds a panel's details by its global index.
 * @param globalIndex The overall index of the panel.
 * @returns An object with panel info, or null if not found.
 */
function getPanelInfoByGlobalIndex(globalIndex: number) {
    if (globalIndex < 0) return null;
    let panelCount = 0;
    for (let i = 0; i < mangaCache.length; i++) {
        const chapter = mangaCache[i];
        if (globalIndex < panelCount + chapter.panelCache.length) {
            const panelIndexInChapter = globalIndex - panelCount;
            return {
                chapter: chapter,
                panel: chapter.panelCache[panelIndexInChapter],
                chapterIndex: i,
                panelIndexInChapter,
                totalPanels: getTotalPanelCount(),
            };
        }
        panelCount += chapter.panelCache.length;
    }
    return null;
}

/** Calculates the total number of panels across all chapters. */
function getTotalPanelCount() {
    return mangaCache.reduce((sum, chapter) => sum + chapter.panelCache.length, 0);
}

/**
 * Displays the reader view for a specific panel.
 * @param index The global index of the panel to display.
 */
function showReader(index: number) {
    currentGlobalPanelIndex = index;
    readerView.classList.remove('hidden');
    document.body.classList.add('reader-active');
    updateReaderUI();
    resetReaderSearchAndFilter();

    if (!userSettings.isMusicMuted) {
        readerAudio.play().catch(e => console.error("Music play failed:", e));
    }
}

/** Closes the reader view. */
function closeReader() {
    if (isImageEditingMode) {
        exitImageEditMode(false); // Discard changes on close
    }
    if (isLinkingPanel) {
        toggleLinkingMode(); // Exit linking mode
    }
    readerView.classList.add('hidden');
    document.body.classList.remove('reader-active');
    readerAudio.pause();
    stopAutoPlay();
    resetZoomAndPan();
    if (isEditingDialogue) {
        cancelDialogueEdit();
    }
    filterOptions.classList.add('hidden');
    closeTextEditor();
    resetReaderSearchAndFilter();
}

/** Shows the next panel in the reader, considering custom links. */
function showNextPanel() {
    stopAutoPlay();
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    if (info.panel.customNextPanelIndex !== undefined) {
        const targetIndex = info.panel.customNextPanelIndex;
        if (targetIndex >= 0 && targetIndex < getTotalPanelCount()) {
            currentGlobalPanelIndex = targetIndex;
            updateReaderUI();
            playSound(sfxAudio);
            return;
        }
    }
    
    if (currentGlobalPanelIndex < getTotalPanelCount() - 1) {
        currentGlobalPanelIndex++;
        updateReaderUI();
        playSound(sfxAudio);
    }
}


/** Shows the previous panel in the reader. */
function showPrevPanel() {
    stopAutoPlay();
    if (currentGlobalPanelIndex > 0) {
        currentGlobalPanelIndex--;
        updateReaderUI();
        playSound(sfxAudio);
    }
}

/** Jumps to the first panel of the next chapter. */
function showNextChapter() {
    stopAutoPlay();
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info || info.chapterIndex >= mangaCache.length - 1) return;

    let nextChapterStartIndex = 0;
    for (let i = 0; i < info.chapterIndex + 1; i++) {
        nextChapterStartIndex += mangaCache[i].panelCache.length;
    }
    
    currentGlobalPanelIndex = nextChapterStartIndex;
    updateReaderUI();
    playSound(sfxAudio);
}

/** Jumps to the first panel of the previous chapter. */
function showPrevChapter() {
    stopAutoPlay();
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info || info.chapterIndex <= 0) return;

    let prevChapterStartIndex = 0;
    for (let i = 0; i < info.chapterIndex - 1; i++) {
        prevChapterStartIndex += mangaCache[i].panelCache.length;
    }
    
    currentGlobalPanelIndex = prevChapterStartIndex;
    updateReaderUI();
    playSound(sfxAudio);
}

/**
 * Updates all elements in the reader view to reflect the current panel.
 */
function updateReaderUI() {
    if (isImageEditingMode) {
        exitImageEditMode(false);
    }
    if (isEditingDialogue) {
        cancelDialogueEdit();
    }
    
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    const content = readerView.querySelector('.reader-content') as HTMLDivElement;
    
    content.classList.add('fading');
    filterOptions.classList.add('hidden');

    clearTimeout(navigationTimeout);
    navigationTimeout = window.setTimeout(() => {
        const { panel, chapter, chapterIndex, totalPanels } = info;
        
        readerChapterTitle.textContent = chapter.title;
        readerImage.src = panel.imageSrc;
        readerImage.alt = getPanelAltText(panel.panelData);
        readerCaption.textContent = `"${panel.panelData.dialogue}"`;
        readerPageIndicator.textContent = `Panel ${currentGlobalPanelIndex + 1} / ${totalPanels}`;

        prevButton.disabled = currentGlobalPanelIndex === 0;
        nextButton.disabled = (currentGlobalPanelIndex === totalPanels - 1) && panel.customNextPanelIndex === undefined;
        prevChapterButton.disabled = chapterIndex === 0;
        nextChapterButton.disabled = chapterIndex === mangaCache.length - 1;

        // Update panel link indicator
        if (panel.customNextPanelIndex !== undefined) {
            panelLinkIndicator.textContent = `Jumps to Panel ${panel.customNextPanelIndex + 1}`;
            panelLinkIndicator.classList.remove('hidden');
        } else {
            panelLinkIndicator.classList.add('hidden');
        }
        
        applyAllCurrentFilters();

        renderReaderThumbnails();
        applyReaderSearchAndFilter();
        renderTextOverlays();
        applyLayerOrder();
        resetZoomAndPan();
        speakPanelNarration(panel.panelData);
        
        content.classList.remove('fading');
    }, 150);
}

/** Renders the thumbnail strip in the reader view. */
function renderReaderThumbnails() {
    readerThumbnailContainer.innerHTML = '';
    let globalPanelIndex = 0;

    mangaCache.forEach((chapter, chapterIndex) => {
        // Add a chapter divider
        if (chapterIndex > 0) {
            const divider = document.createElement('div');
            divider.className = 'thumbnail-chapter-divider';
            divider.textContent = `Ch. ${chapterIndex + 1}`;
            readerThumbnailContainer.appendChild(divider);
        }

        chapter.panelCache.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'thumbnail-wrapper';
            
            const thumbnail = document.createElement('img');
            thumbnail.src = item.imageSrc;
            thumbnail.alt = getPanelAltText(item.panelData);
            thumbnail.className = 'reader-thumbnail';
            thumbnail.dataset.globalIndex = globalPanelIndex.toString();
            thumbnail.draggable = true;
            
            if (item.customNextPanelIndex !== undefined) {
                const linkIndicator = document.createElement('div');
                linkIndicator.className = 'thumbnail-link-indicator';
                linkIndicator.textContent = '🔗';
                wrapper.appendChild(linkIndicator);
            }

            if (globalPanelIndex === currentGlobalPanelIndex) {
                thumbnail.classList.add('active');
            }

            thumbnail.addEventListener('click', () => {
                if (isLinkingPanel) {
                    createPanelLink(parseInt(thumbnail.dataset.globalIndex!, 10));
                } else {
                    stopAutoPlay();
                    currentGlobalPanelIndex = parseInt(thumbnail.dataset.globalIndex!, 10);
                    updateReaderUI();
                }
            });

            wrapper.appendChild(thumbnail);
            readerThumbnailContainer.appendChild(wrapper);
            globalPanelIndex++;
        });
    });
    
    const activeThumbnail = readerThumbnailContainer.querySelector<HTMLElement>('.active');
    activeThumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}


// --- DRAG AND DROP (READER THUMBNAILS) ---
let draggedThumbnail: HTMLElement | null = null;
let overThumbnail: HTMLElement | null = null;
let dragOverThumbnailPosition: 'left' | 'right' | null = null;

function clearThumbnailDragStyles() {
    if (overThumbnail) {
        overThumbnail.classList.remove('drag-over-left', 'drag-over-right');
    }
    overThumbnail = null;
    dragOverThumbnailPosition = null;
}

readerThumbnailContainer.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('reader-thumbnail')) {
        draggedThumbnail = target;
        stopAutoPlay();
        setTimeout(() => target.classList.add('dragging'), 0);
    }
});

readerThumbnailContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest('.reader-thumbnail');
    if (!target || target === draggedThumbnail) {
        clearThumbnailDragStyles();
        return;
    }

    if (target !== overThumbnail) {
        clearThumbnailDragStyles();
        overThumbnail = target as HTMLElement;
    }

    const rect = target.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    if (e.clientX < midpoint) {
        if (dragOverThumbnailPosition !== 'left') {
            target.classList.add('drag-over-left');
            target.classList.remove('drag-over-right');
            dragOverThumbnailPosition = 'left';
        }
    } else {
        if (dragOverThumbnailPosition !== 'right') {
            target.classList.add('drag-over-right');
            target.classList.remove('drag-over-left');
            dragOverThumbnailPosition = 'right';
        }
    }
});

readerThumbnailContainer.addEventListener('dragleave', (e) => {
    const target = (e.target as HTMLElement).closest('.reader-thumbnail');
    if (target === overThumbnail) {
       const rect = target.getBoundingClientRect();
       if (e.clientX <= rect.left || e.clientX >= rect.right || e.clientY <= rect.top || e.clientY >= rect.bottom) {
           clearThumbnailDragStyles();
       }
    }
});

readerThumbnailContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedThumbnail || !overThumbnail) {
        clearThumbnailDragStyles();
        return;
    }

    const fromGlobalIndex = parseInt(draggedThumbnail.dataset.globalIndex!, 10);
    const toGlobalIndex = parseInt(overThumbnail.dataset.globalIndex!, 10);

    if (fromGlobalIndex === toGlobalIndex) return;

    // Find the panel and remove it from its original chapter
    const fromInfo = getPanelInfoByGlobalIndex(fromGlobalIndex);
    if (!fromInfo) return;
    const [movedItem] = mangaCache[fromInfo.chapterIndex].panelCache.splice(fromInfo.panelIndexInChapter, 1);
    
    // Find the target position
    const toInfo = getPanelInfoByGlobalIndex(toGlobalIndex);
    if (!toInfo) return;

    let targetChapterIndex = toInfo.chapterIndex;
    let targetPanelIndex = toInfo.panelIndexInChapter;

    // Adjust the drop position based on where the cursor is on the target thumbnail
    if (dragOverThumbnailPosition === 'right') {
        targetPanelIndex++;
    }
    
    // Insert the item into the target chapter at the target index
    mangaCache[targetChapterIndex].panelCache.splice(targetPanelIndex, 0, movedItem);

    // Clean up empty chapters
    mangaCache = mangaCache.filter(chapter => chapter.panelCache.length > 0);
    
    // Find the new global index of the moved item
    currentGlobalPanelIndex = getPanelInfoByGlobalIndex(fromGlobalIndex)?.panel === movedItem 
        ? fromGlobalIndex 
        : (() => {
            let idx = 0;
            for (const chapter of mangaCache) {
                for (const panel of chapter.panelCache) {
                    if (panel.id === movedItem.id) return idx;
                    idx++;
                }
            }
            return -1;
        })();
        
    // Re-render main grid, update reader UI, and save
    renderMangaGrid();
    updateReaderUI();
    saveStoryToLocalStorage();

    clearThumbnailDragStyles();
});

readerThumbnailContainer.addEventListener('dragend', () => {
    if (draggedThumbnail) {
        draggedThumbnail.classList.remove('dragging');
    }
    draggedThumbnail = null;
    clearThumbnailDragStyles();
});

// --- READER SEARCH AND FILTER ---

/** Applies search and filter criteria to the reader thumbnails. */
function applyReaderSearchAndFilter() {
    const searchTerm = readerSearchInput.value.toLowerCase().trim();
    const filterHasFilter = readerFilterToggles.querySelector('[data-filter-type="has-filter"]')?.classList.contains('active');
    const filterHasText = readerFilterToggles.querySelector('[data-filter-type="has-text"]')?.classList.contains('active');

    const allPanels = mangaCache.flatMap(c => c.panelCache);
    const thumbnailWrappers = readerThumbnailContainer.querySelectorAll<HTMLDivElement>('.thumbnail-wrapper');

    allPanels.forEach((item, index) => {
        const wrapper = thumbnailWrappers[index];
        if (!wrapper) return;

        let isMatch = true;
        if (searchTerm && !item.panelData.dialogue.toLowerCase().includes(searchTerm)) isMatch = false;
        
        const hasIntensityFilter = item.filterIntensities.grayscale > 0 || item.filterIntensities.sepia > 0 || item.filterIntensities.invert > 0 || item.filterIntensities.sketch > 0;
        if (filterHasFilter && item.blur === 0 && !hasIntensityFilter) isMatch = false;
        
        if (filterHasText && item.textOverlays.length === 0) isMatch = false;

        const thumbnail = wrapper.querySelector<HTMLImageElement>('.reader-thumbnail');
        thumbnail?.classList.toggle('match', isMatch);
        thumbnail?.classList.toggle('no-match', !isMatch);
    });
}

/** Resets the search and filter UI and state. */
function resetReaderSearchAndFilter() {
    readerSearchInput.value = '';
    readerFilterToggles.querySelectorAll<HTMLButtonElement>('.active').forEach(btn => btn.classList.remove('active'));
    applyReaderSearchAndFilter();
}


// --- AUTO-ADVANCE / SLIDESHOW ---

/** Advances the slideshow to the next panel, called when narration ends. */
function autoAdvancePanel() {
    if (!isAutoPlaying) return;
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) {
        stopAutoPlay();
        return;
    }
    
    // Check if we can advance at all
    const canAdvance = (currentGlobalPanelIndex < getTotalPanelCount() - 1) || info.panel.customNextPanelIndex !== undefined;

    if (canAdvance) {
        showNextPanel();
    } else {
        stopAutoPlay(); // Reached the end
    }
}


/** Starts the speech-driven auto-play slideshow. */
function startAutoPlay() {
    isAutoPlaying = true;
    playPauseButton.innerHTML = '⏸️';
    playPauseButton.setAttribute('aria-label', 'Pause slideshow');
    const currentItemInfo = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (currentItemInfo) {
        speakPanelNarration(currentItemInfo.panel.panelData);
    }
}

/** Stops the auto-play slideshow and any active narration. */
function stopAutoPlay() {
    isAutoPlaying = false;
    window.speechSynthesis.cancel();
    playPauseButton.innerHTML = '▶️';
    playPauseButton.setAttribute('aria-label', 'Play slideshow');
}

/** Toggles the auto-play state. */
function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
        if (!info) return;
        const canAdvance = (currentGlobalPanelIndex < getTotalPanelCount() - 1) || info.panel.customNextPanelIndex !== undefined;

        if (!canAdvance) {
            currentGlobalPanelIndex = 0;
            updateReaderUI();
        }
        startAutoPlay();
    }
}

// --- READER UTILITIES (Narration, Zoom, Audio, Share, Download) ---

/** Populates the voice selection dropdown. */
function populateVoiceList() {
    const voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    if (voices.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No voices available';
        voiceSelect.appendChild(option);
        return;
    }

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });

    if (userSettings.narrationVoiceName && voices.some(v => v.name === userSettings.narrationVoiceName)) {
        voiceSelect.value = userSettings.narrationVoiceName;
    } else {
        userSettings.narrationVoiceName = voices[0]?.name || null;
    }
}


/**
 * Uses the Web Speech API to narrate a panel's text.
 * @param panelData The data for the panel to narrate.
 */
function speakPanelNarration(panelData: MangaPanelStory) {
    window.speechSynthesis.cancel();
    if (!userSettings.isNarrationEnabled) return;

    const textToSpeak = (panelData.dialogue && panelData.dialogue.trim() !== '...') 
        ? panelData.dialogue 
        : panelData.description;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = userSettings.narrationSpeed;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === userSettings.narrationVoiceName);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.onend = autoAdvancePanel;
    
    window.speechSynthesis.speak(utterance);
}

function resetZoomAndPan() {
    isZoomed = false;
    isPanning = false;
    hasDragged = false;
    readerImage.classList.remove('zoomed', 'panning');
    readerImage.style.transform = '';
    readerImage.style.transformOrigin = '';
}

function toggleZoom(event: MouseEvent | TouchEvent) {
    if (isZoomed) {
        resetZoomAndPan();
    } else {
        isZoomed = true;
        readerImage.classList.add('zoomed');

        const rect = readerImage.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        readerImage.style.transformOrigin = `${x}% ${y}%`;
    }
}

function handlePanStart(event: MouseEvent | TouchEvent) {
    if (!isZoomed || isImageEditingMode) return;
    event.preventDefault();
    isPanning = true;
    readerImage.classList.add('panning');

    panStartX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    panStartY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const transform = window.getComputedStyle(readerImage).transform;
    if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        panInitialX = matrix.e;
        panInitialY = matrix.f;
    } else {
        panInitialX = 0;
        panInitialY = 0;
    }
}

function handlePanMove(event: MouseEvent | TouchEvent) {
    if (!isPanning || isImageEditingMode) return;
    event.preventDefault();
    hasDragged = true;

    const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const dx = currentX - panStartX;
    const dy = currentY - panStartY;
    
    readerImage.style.transform = `translate(${panInitialX + dx}px, ${panInitialY + dy}px) scale(2)`;
}

function handlePanEnd() {
    isPanning = false;
    readerImage.classList.remove('panning');
}

function handleImageClick(e: MouseEvent) {
    if (isImageEditingMode) return;
    if (hasDragged) {
        hasDragged = false;
        return;
    }
    toggleZoom(e);
}

function handleImageTouch(e: TouchEvent) {
    if (isImageEditingMode) return;
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTap;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        e.preventDefault();
        toggleZoom(e);
    }
    lastTap = currentTime;
}

function showShareNotification(message: string) {
    shareNotification.textContent = message;
    shareNotification.classList.remove('hidden');
    shareNotification.classList.add('visible');

    clearTimeout(notificationTimeout);
    notificationTimeout = window.setTimeout(() => {
        shareNotification.classList.remove('visible');
    }, 2000);
}

async function shareMangaPanel() {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info || info.panel.isPlaceholder) {
        showShareNotification('Cannot share a placeholder image.');
        return;
    }

    try {
        const response = await fetch(info.panel.imageSrc);
        const blob = await response.blob();
        const file = new File([blob], `manga-panel-${currentGlobalPanelIndex + 1}.jpg`, { type: 'image/jpeg' });
        
        const shareData = {
            title: 'AI Manga Panel',
            text: `Check out this manga panel I created! "${info.panel.panelData.dialogue}"`,
            files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            showShareNotification('Web Share not supported on this browser.');
        }
    } catch (err) {
        console.error('Share failed:', err);
        showShareNotification('Sharing failed.');
    }
}

function toggleMusic() {
    userSettings.isMusicMuted = !userSettings.isMusicMuted;
    if (userSettings.isMusicMuted) {
        readerAudio.pause();
        musicToggleButton.innerHTML = '🎵<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-3px, -2px);">/</span>';
    } else {
        if (readerView.classList.contains('hidden') === false) {
             readerAudio.play().catch(e => console.error("Audio play failed:", e));
        }
        musicToggleButton.innerHTML = '🎵';
    }
    saveUserSettings();
}

function toggleSfx() {
    userSettings.isSfxMuted = !userSettings.isSfxMuted;
    sfxToggleButton.innerHTML = userSettings.isSfxMuted ? '🔊<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-2px, -2px);">/</span>' : '🔊';
    saveUserSettings();
}

function toggleNarration() {
    userSettings.isNarrationEnabled = !userSettings.isNarrationEnabled;
    narrationToggleButton.innerHTML = userSettings.isNarrationEnabled ? '🗣️' : '🗣️<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-2px, -2px);">/</span>';
    const currentItemInfo = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (userSettings.isNarrationEnabled) {
        if (currentItemInfo) {
            speakPanelNarration(currentItemInfo.panel.panelData);
        }
    } else {
        window.speechSynthesis.cancel();
    }
    saveUserSettings();
}

/** Populates the PDF export dropdown with options. */
function populatePdfExportOptions() {
    pdfExportOptions.innerHTML = '';

    // Option for all chapters
    const allButton = document.createElement('button');
    allButton.textContent = 'Export All as PDF';
    allButton.onclick = () => downloadAsPdf(true);
    pdfExportOptions.appendChild(allButton);
    
    if (mangaCache.length > 1) {
         const divider = document.createElement('div');
         divider.className = 'dropdown-divider';
         pdfExportOptions.appendChild(divider);
        
        // Options for each chapter
        mangaCache.forEach((chapter, index) => {
            const chapterButton = document.createElement('button');
            chapterButton.textContent = `Export Ch. ${index + 1}: ${chapter.title}`;
            chapterButton.onclick = () => downloadChapterAsPdf(index);
            pdfExportOptions.appendChild(chapterButton);
        });
    }
}

async function downloadChapterAsPdf(chapterIndex: number) {
    const chapter = mangaCache[chapterIndex];
    if (!chapter) return;

    pdfExportDropdown.style.pointerEvents = 'none';
    const originalButtonText = pdfExportOptions.children[chapterIndex + 2]?.textContent;
    if (originalButtonText) {
        (pdfExportOptions.children[chapterIndex + 2] as HTMLButtonElement).textContent = 'Preparing...';
    }

    const doc = new jsPDF();
    const panels = chapter.panelCache.filter(p => !p.isPlaceholder);

    for (let i = 0; i < panels.length; i++) {
        const item = panels[i];
        if (i > 0) doc.addPage();
        doc.setFontSize(12);
        doc.text(chapter.title, 10, 15);
        doc.setFontSize(10);
        doc.text(`Page ${i + 1}: "${item.panelData.dialogue}"`, 10, 25);
        doc.addImage(item.imageSrc, 'JPEG', 10, 30, 190, 190);
    }

    doc.save(`ai-manga-chapter-${chapterIndex + 1}.pdf`);
    
    if (originalButtonText) {
        (pdfExportOptions.children[chapterIndex + 2] as HTMLButtonElement).textContent = originalButtonText;
    }
    pdfExportDropdown.style.pointerEvents = 'auto';
}

async function downloadAsPdf(isFromDropdown: boolean = false) {
    const button = isFromDropdown ? pdfExportOptions.children[0] as HTMLButtonElement : downloadButton;
    pdfExportDropdown.style.pointerEvents = 'none';
    const originalText = button.textContent;
    button.textContent = 'Preparing PDF...';
    
    const doc = new jsPDF();
    const allPanels = mangaCache.flatMap(c => c.panelCache).filter(p => !p.isPlaceholder);
    let panelCounter = 0;

    for (let c = 0; c < mangaCache.length; c++) {
        const chapter = mangaCache[c];
        const chapterPanels = chapter.panelCache.filter(p => !p.isPlaceholder);
        
        for (let i = 0; i < chapterPanels.length; i++) {
            const item = chapterPanels[i];
            if (panelCounter > 0) doc.addPage();
            
            doc.setFontSize(12);
            doc.text(chapter.title, 10, 15);
            doc.setFontSize(10);
            doc.text(`Panel ${panelCounter + 1}: "${item.panelData.dialogue}"`, 10, 25);
            doc.addImage(item.imageSrc, 'JPEG', 10, 30, 190, 190);
            panelCounter++;
        }
    }

    doc.save('ai-manga.pdf');
    button.textContent = originalText;
    pdfExportDropdown.style.pointerEvents = 'auto';
}

async function exportAsImages() {
    exportImagesButton.disabled = true;
    exportImagesButton.textContent = 'Zipping PNGs...';

    const zip = new JSZip();
    const allPanels = mangaCache.flatMap(c => c.panelCache).filter(p => !p.isPlaceholder);

    for (let i = 0; i < allPanels.length; i++) {
        const item = allPanels[i];
        const response = await fetch(item.imageSrc);
        const blob = await response.blob();
        zip.file(`panel-${String(i + 1).padStart(3, '0')}.png`, blob);
    }

    try {
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'ai-manga-images-png.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Failed to export images:", error);
    } finally {
        exportImagesButton.textContent = 'Export as Images';
        exportImagesButton.disabled = false;
    }
}

async function exportAsGif() {
    exportGifButton.disabled = true;
    exportGifButton.textContent = 'Creating GIF...';

    const allPanels = mangaCache.flatMap(c => c.panelCache).filter(p => !p.isPlaceholder);
    if (allPanels.length === 0) {
        exportGifButton.textContent = 'Export as GIF';
        exportGifButton.disabled = false;
        return;
    }

    const gif = new GIF({ workers: 2, quality: 10, width: 512, height: 512 });

    const imageLoadPromises = allPanels.map(item => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = item.imageSrc;
    }));

    try {
        const loadedImages = await Promise.all(imageLoadPromises);
        
        loadedImages.forEach(img => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 512, 512);
            ctx.drawImage(img, 0, 0, 512, 512);
            gif.addFrame(canvas, { delay: 2000 });
        });

        gif.on('finished', (blob: Blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ai-manga.gif';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            exportGifButton.textContent = 'Export as GIF';
            exportGifButton.disabled = false;
        });

        gif.render();
    } catch (error) {
        console.error("Failed to export GIF:", error);
        exportGifButton.textContent = 'Export as GIF';
        exportGifButton.disabled = false;
    }
}

// --- STORYBOARD EDITING ---

function openStoryboardEditModal(chapterIndex: number, panelIndex: number) {
    if (!currentStoryData) return;
    currentlyEditingStoryboardPanel = { chapterIndex, panelIndex };
    const description = currentStoryData.chapters[chapterIndex].panels[panelIndex].description;
    storyboardDescriptionInput.value = description;
    storyboardEditModal.classList.remove('hidden');
    storyboardDescriptionInput.focus();
}

function closeStoryboardEditModal() {
    storyboardEditModal.classList.add('hidden');
    currentlyEditingStoryboardPanel = null;
}

function saveStoryboardEdit() {
    if (!currentlyEditingStoryboardPanel || !currentStoryData) return;
    const { chapterIndex, panelIndex } = currentlyEditingStoryboardPanel;
    const newDescription = storyboardDescriptionInput.value;

    // Update the central story data
    currentStoryData.chapters[chapterIndex].panels[panelIndex].description = newDescription;

    // Update the UI in the storyboard view
    const panelDiv = document.getElementById(`storyboard-panel-${chapterIndex}-${panelIndex}`);
    if (panelDiv) {
        const p = panelDiv.querySelector('p:first-of-type');
        if (p) {
            p.innerHTML = `<strong>Description:</strong> ${newDescription}`;
        }
    }
    closeStoryboardEditModal();
}


// --- PANEL EDITING FEATURES (Regen, Dialogue, Filter, Text) ---

function openRegenerationModal() {
    stopAutoPlay();
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    modalDescriptionInput.value = info.panel.panelData.description;
    modalError.style.display = 'none';
    regenerationModal.classList.remove('hidden');
}

function closeRegenerationModal() {
    regenerationModal.classList.add('hidden');
    modalLoader.classList.add('hidden');
}

async function handleRegenerateImage() {
    const newDescription = modalDescriptionInput.value.trim();
    if (!newDescription) {
        modalError.textContent = 'Description cannot be empty.';
        modalError.style.display = 'block';
        return;
    }
    
    modalError.style.display = 'none';
    modalLoader.classList.remove('hidden');
    modalRegenerateButton.disabled = true;

    try {
        const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
        if (!info || !currentStoryData) throw new Error("Could not find panel to regenerate.");

        const { panel, chapterIndex, panelIndexInChapter } = info;
        const panelData = { ...panel.panelData, description: newDescription };
        
        const imageSrc = await generatePanelImage(panelData, currentStoryData);

        const currentPanel = mangaCache[chapterIndex].panelCache[panelIndexInChapter];
        currentPanel.imageSrc = imageSrc;
        currentPanel.panelData.description = newDescription;
        currentPanel.isPlaceholder = false;
        // Reset edit history after regeneration
        delete currentPanel.editHistory;
        delete currentPanel.editHistoryIndex;
        delete currentPanel.brushSettings;

        updateReaderUI();
        
        const gridPanel = mangaContainer.querySelector(`.manga-panel[data-global-index="${currentGlobalPanelIndex}"]`);
        if (gridPanel) {
            const gridImg = gridPanel.querySelector('img');
            if (gridImg) gridImg.src = imageSrc;
        }

        saveStoryToLocalStorage();
        closeRegenerationModal();
    } catch (error) {
        console.error('Image regeneration failed:', error);
        modalError.textContent = 'Failed to regenerate image. Please try again.';
        modalError.style.display = 'block';
    } finally {
        modalLoader.classList.add('hidden');
        modalRegenerateButton.disabled = false;
    }
}

function startDialogueEdit() {
    if (isEditingDialogue) return;
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    isEditingDialogue = true;
    dialogueEditTextarea.value = info.panel.panelData.dialogue;
    readerCaption.style.opacity = '0';
    dialogueEditOverlay.classList.remove('hidden');
    dialogueEditTextarea.focus();
    dialogueEditTextarea.style.height = 'auto';
    dialogueEditTextarea.style.height = `${dialogueEditTextarea.scrollHeight}px`;
}

function saveDialogueEdit() {
    if (!isEditingDialogue) return;
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    const newDialogue = dialogueEditTextarea.value.trim();
    readerCaption.textContent = `"${newDialogue}"`;
    info.panel.panelData.dialogue = newDialogue;

    const gridPanel = mangaContainer.querySelector(`.manga-panel[data-global-index="${currentGlobalPanelIndex}"]`);
    if (gridPanel) {
        const gridCaption = gridPanel.querySelector<HTMLParagraphElement>('.panel-caption');
        if (gridCaption) gridCaption.textContent = `"${newDialogue}"`;
    }
    saveStoryToLocalStorage();
    
    isEditingDialogue = false;
    readerCaption.style.opacity = '1';
    dialogueEditOverlay.classList.add('hidden');
}

function cancelDialogueEdit() {
    if (!isEditingDialogue) return;
    isEditingDialogue = false;
    readerCaption.style.opacity = '1';
    dialogueEditOverlay.classList.add('hidden');
}

function applyAllCurrentFilters() {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;
    const { panel } = info;

    let filterString = '';
    
    // Sketch filter is a combination of other filters
    if (panel.filterIntensities.sketch > 0) {
        const sketch = panel.filterIntensities.sketch / 100; // 0 to 1
        const grayscale = sketch * 100;
        const contrast = 100 + (sketch * 100);
        const brightness = 100 + (sketch * 10);
        filterString += `grayscale(${grayscale}%) contrast(${contrast}%) brightness(${brightness}%) `;
    }
    
    if (panel.filterIntensities.grayscale > 0) {
        filterString += `grayscale(${panel.filterIntensities.grayscale}%) `;
    }
    if (panel.filterIntensities.sepia > 0) {
        filterString += `sepia(${panel.filterIntensities.sepia}%) `;
    }
    if (panel.filterIntensities.invert > 0) {
        filterString += `invert(${panel.filterIntensities.invert}%) `;
    }
    
    // Blur is always additive
    if (panel.blur > 0) {
        filterString += `blur(${panel.blur}px) `;
    }

    readerImage.style.filter = filterString.trim();
}


function applyFilter(filter: FilterType) {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;
    info.panel.filter = filter;

    // Reset all intensities when 'None' is clicked
    if (filter === 'none') {
        info.panel.blur = 0;
        info.panel.filterIntensities = { grayscale: 0, sepia: 0, invert: 0, sketch: 0 };
    }
    
    applyAllCurrentFilters();
    saveStoryToLocalStorage();
    filterOptions.classList.add('hidden');
}

function handleClearAllFilters() {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    // Reset panel data
    const { panel } = info;
    panel.blur = 0;
    panel.filter = 'none';
    panel.filterIntensities = {
        grayscale: 0,
        sepia: 0,
        invert: 0,
        sketch: 0,
    };

    // Update UI
    applyAllCurrentFilters();

    // Update sliders and value displays in the filter panel
    blurSlider.value = '0';
    blurValue.textContent = '0';
    grayscaleSlider.value = '0';
    grayscaleValue.textContent = '0';
    sepiaSlider.value = '0';
    sepiaValue.textContent = '0';
    invertSlider.value = '0';
    invertValue.textContent = '0';
    sketchSlider.value = '0';
    sketchValue.textContent = '0';

    // Persist changes
    saveStoryToLocalStorage();
    
    // Optional: close the panel
    filterOptions.classList.add('hidden');
}


function generateCombinedTextShadow(overlay: TextOverlay): string {
    const shadows: string[] = [];
    const width = overlay.outlineWidth;
    if (width > 0) {
        for (let y = -width; y <= width; y++) {
            for (let x = -width; x <= width; x++) {
                if (x !== 0 || y !== 0) shadows.push(`${x}px ${y}px 0 ${overlay.outlineColor}`);
            }
        }
    }
    if (overlay.shadowBlur > 0 || overlay.shadowOffsetX !== 0 || overlay.shadowOffsetY !== 0) {
        shadows.push(`${overlay.shadowOffsetX}px ${overlay.shadowOffsetY}px ${overlay.shadowBlur}px ${overlay.shadowColor}`);
    }
    return shadows.join(', ');
}

function renderTextOverlays() {
    overlayContainer.innerHTML = '';
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;
    const overlays = info.panel.textOverlays;

    overlays.forEach(overlay => {
        const textElement = document.createElement('div');
        textElement.id = overlay.id;
        textElement.className = 'text-overlay-item';
        textElement.textContent = overlay.text;
        textElement.style.left = `${overlay.x}%`;
        textElement.style.top = `${overlay.y}%`;
        textElement.style.fontSize = `${overlay.fontSize}px`;
        textElement.style.color = overlay.color;
        textElement.style.fontFamily = overlay.fontFamily;
        textElement.style.textAlign = overlay.textAlign;
        textElement.style.textShadow = generateCombinedTextShadow(overlay);
        textElement.style.opacity = overlay.opacity.toString();
        textElement.style.lineHeight = overlay.lineHeight.toString();
        textElement.style.letterSpacing = `${overlay.letterSpacing}px`;
        textElement.style.textDecoration = overlay.textDecoration;
        textElement.style.display = overlay.visible ? 'block' : 'none';
        textElement.addEventListener('mousedown', startDragText);
        textElement.addEventListener('touchstart', startDragText);
        textElement.addEventListener('dblclick', () => openTextEditor(overlay.id));
        overlayContainer.appendChild(textElement);
    });
}

function startDragText(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    draggedTextElement = e.target as HTMLElement;
    const rect = draggedTextElement.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    textDragOffsetX = clientX - rect.left;
    textDragOffsetY = clientY - rect.top;
    document.addEventListener('mousemove', dragText);
    document.addEventListener('touchmove', dragText);
    document.addEventListener('mouseup', endDragText);
    document.addEventListener('touchend', endDragText);
}

function dragText(e: MouseEvent | TouchEvent) {
    if (!draggedTextElement) return;
    const containerRect = overlayContainer.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    let newX = clientX - containerRect.left - textDragOffsetX;
    let newY = clientY - containerRect.top - textDragOffsetY;
    let newXPercent = (newX / containerRect.width) * 100;
    let newYPercent = (newY / containerRect.height) * 100;
    newXPercent = Math.max(0, Math.min(100 - (draggedTextElement.offsetWidth / containerRect.width * 100), newXPercent));
    newYPercent = Math.max(0, Math.min(100 - (draggedTextElement.offsetHeight / containerRect.height * 100), newYPercent));
    draggedTextElement.style.left = `${newXPercent}%`;
    draggedTextElement.style.top = `${newYPercent}%`;
}

function endDragText() {
    if (!draggedTextElement) return;
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    const overlayId = draggedTextElement.id;
    const overlay = info.panel.textOverlays.find(o => o.id === overlayId);
    if (overlay) {
        overlay.x = parseFloat(draggedTextElement.style.left);
        overlay.y = parseFloat(draggedTextElement.style.top);
        saveStoryToLocalStorage();
    }
    draggedTextElement = null;
    document.removeEventListener('mousemove', dragText);
    document.removeEventListener('touchmove', dragText);
    document.removeEventListener('mouseup', endDragText);
    document.removeEventListener('touchend', endDragText);
}


function openTextEditor(id: string | null = null) {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;
    
    // Normalize layer order if it's missing or inconsistent
    const { panel } = info;
    const textOverlayIds = panel.textOverlays.map(o => o.id);
    if (!panel.layerOrder || panel.layerOrder.length !== textOverlayIds.length + 1) {
        panel.layerOrder = ['drawing-layer', ...textOverlayIds];
    }

    textOverlayEditor.classList.remove('hidden');

    if (id) {
        handleLayerSelection(id);
    } else {
        // Adding new text: create it first, then select it
        const newOverlay: TextOverlay = {
            id: `text-${Date.now()}`, text: 'New Text', color: '#FFFFFF', fontSize: 32,
            x: 20, y: 20, outlineWidth: 2, outlineColor: '#000000',
            textAlign: 'center', fontFamily: 'Arial, sans-serif', shadowColor: '#000000',
            shadowOffsetX: 2, shadowOffsetY: 2, shadowBlur: 3, opacity: 1,
            lineHeight: 1.2, letterSpacing: 0, textDecoration: 'none', visible: true,
        };
        panel.textOverlays.push(newOverlay);
        panel.layerOrder.push(newOverlay.id); // Add to top of layer stack
        
        saveStoryToLocalStorage();
        renderTextOverlays();
        applyLayerOrder();
        handleLayerSelection(newOverlay.id);
    }
}

function closeTextEditor() {
    textOverlayEditor.classList.add('hidden');
    currentlySelectedLayerId = null;
}

function updateTextOverlayFromEditor() {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info || !currentlySelectedLayerId || currentlySelectedLayerId === 'drawing-layer') return;
    
    const overlay = info.panel.textOverlays.find(o => o.id === currentlySelectedLayerId);
    if (!overlay) return;

    overlay.text = textOverlayInput.value;
    overlay.fontSize = parseInt(textOverlaySize.value, 10);
    overlay.color = textOverlayColor.value;
    overlay.outlineWidth = parseInt(textOverlayOutlineWidth.value, 10);
    overlay.outlineColor = textOverlayOutlineColor.value;
    overlay.fontFamily = textOverlayFont.value;
    const activeButton = alignmentControls.querySelector<HTMLButtonElement>('.active');
    overlay.textAlign = activeButton?.dataset.align as 'left'|'center'|'right' ?? 'center';
    overlay.shadowColor = textOverlayShadowColor.value;
    overlay.shadowOffsetX = parseInt(textOverlayShadowX.value, 10);
    overlay.shadowOffsetY = parseInt(textOverlayShadowY.value, 10);
    overlay.shadowBlur = parseInt(textOverlayShadowBlur.value, 10);
    overlay.opacity = parseFloat(textOverlayOpacity.value);
    overlay.lineHeight = parseFloat(textOverlayLineHeight.value);
    overlay.letterSpacing = parseFloat(textOverlayLetterSpacing.value);

    const decorations: string[] = [];
    textDecorationControls.querySelectorAll<HTMLButtonElement>('button.active').forEach(btn => decorations.push(btn.dataset.decoration!));
    overlay.textDecoration = (decorations.join(' ') || 'none') as TextOverlay['textDecoration'];

    renderTextOverlays();
    saveStoryToLocalStorage();
    renderLayerList(); // Re-render to update text content in list
}

function deleteTextOverlay() {
    if (!currentlySelectedLayerId || currentlySelectedLayerId === 'drawing-layer') return;
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    const textIndex = info.panel.textOverlays.findIndex(o => o.id === currentlySelectedLayerId);
    if (textIndex > -1) {
        info.panel.textOverlays.splice(textIndex, 1);
    }
    
    const layerIndex = info.panel.layerOrder.indexOf(currentlySelectedLayerId);
    if (layerIndex > -1) {
        info.panel.layerOrder.splice(layerIndex, 1);
    }

    renderTextOverlays();
    applyLayerOrder();
    saveStoryToLocalStorage();
    
    currentlySelectedLayerId = null;
    drawingLayerControls.classList.add('hidden');
    textLayerControls.classList.add('hidden');
    renderLayerList();
}

function handleLayerSelection(layerId: string) {
    currentlySelectedLayerId = layerId;
    renderLayerList(); // Re-render to update active state

    if (layerId === 'drawing-layer') {
        const panel = getPanelInfoByGlobalIndex(currentGlobalPanelIndex)!.panel;
        drawingLayerControls.classList.remove('hidden');
        textLayerControls.classList.add('hidden');
        textOverlayDeleteButton.classList.add('hidden');
        drawingLayerOpacity.value = panel.drawingLayerOpacity.toString();
    } else {
        const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
        if (!info) return;
        const overlay = info.panel.textOverlays.find(o => o.id === layerId);
        if (!overlay) return;
        
        drawingLayerControls.classList.add('hidden');
        textLayerControls.classList.remove('hidden');
        textOverlayDeleteButton.classList.remove('hidden');
        
        textOverlayInput.value = overlay.text;
        textOverlaySize.value = overlay.fontSize.toString();
        textOverlayColor.value = overlay.color;
        textOverlayOutlineWidth.value = overlay.outlineWidth.toString();
        textOverlayOutlineColor.value = overlay.outlineColor;
        textOverlayFont.value = overlay.fontFamily;
        textOverlayShadowColor.value = overlay.shadowColor || '#000000';
        textOverlayShadowX.value = (overlay.shadowOffsetX ?? 2).toString();
        textOverlayShadowY.value = (overlay.shadowOffsetY ?? 2).toString();
        textOverlayShadowBlur.value = (overlay.shadowBlur ?? 3).toString();
        textOverlayOpacity.value = overlay.opacity.toString();
        textOverlayLineHeight.value = overlay.lineHeight.toString();
        textOverlayLetterSpacing.value = overlay.letterSpacing.toString();
        
        alignmentControls.querySelectorAll<HTMLButtonElement>('button').forEach(btn => btn.classList.toggle('active', btn.dataset.align === overlay.textAlign));
        textDecorationControls.querySelectorAll<HTMLButtonElement>('button').forEach(btn => btn.classList.toggle('active', overlay.textDecoration.includes(btn.dataset.decoration!)));
    }
}

function toggleLayerVisibility(layerId: string) {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;
    const { panel } = info;

    if (layerId === 'drawing-layer') {
        panel.drawingLayerVisible = !panel.drawingLayerVisible;
    } else {
        const overlay = panel.textOverlays.find(o => o.id === layerId);
        if (overlay) {
            overlay.visible = !overlay.visible;
        }
    }
    
    saveStoryToLocalStorage();
    renderTextOverlays();
    applyLayerOrder();
    renderLayerList(); // Re-render the list to update styles and icon
}

function renderLayerList() {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;
    textOverlayLayerList.innerHTML = '';
    
    const { panel } = info;
    // Render from top to bottom, so reverse the layerOrder array for display
    [...panel.layerOrder].reverse().forEach(layerId => {
        const li = document.createElement('li');
        li.className = 'layer-item';
        li.dataset.layerId = layerId;
        li.draggable = true;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'layer-item-name';
        
        // Create the visibility toggle button
        const visibilityButton = document.createElement('button');
        visibilityButton.className = 'layer-visibility-toggle';
        visibilityButton.setAttribute('aria-label', 'Toggle visibility');
        visibilityButton.setAttribute('title', 'Toggle visibility');
        visibilityButton.onclick = (e) => {
            e.stopPropagation(); // Prevent layer selection when clicking the eye
            toggleLayerVisibility(layerId);
        };
        
        if (layerId === 'drawing-layer') {
            nameSpan.textContent = 'Drawing Layer';
            li.classList.add('drawing-layer');
            visibilityButton.innerHTML = panel.drawingLayerVisible 
                ? '👁️' 
                : '👁️<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-2px, -3px);">/</span>';
            if (!panel.drawingLayerVisible) li.classList.add('layer-hidden');
        } else {
            const overlay = panel.textOverlays.find(o => o.id === layerId);
            if (overlay) {
                nameSpan.textContent = overlay.text.substring(0, 20) || '(empty)';
                visibilityButton.innerHTML = overlay.visible 
                    ? '👁️' 
                    : '👁️<span style="position: absolute; font-size: 1.5rem; color: red; transform: translate(-2px, -3px);">/</span>';
                if (!overlay.visible) li.classList.add('layer-hidden');
            } else {
                nameSpan.textContent = 'Unknown Layer';
                visibilityButton.textContent = '❓';
            }
        }

        if (layerId === currentlySelectedLayerId) {
            li.classList.add('active');
        }

        li.addEventListener('click', () => handleLayerSelection(layerId));
        // Append: visibility button, then name
        li.appendChild(visibilityButton);
        li.appendChild(nameSpan);
        textOverlayLayerList.appendChild(li);
    });
}

function applyLayerOrder() {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;
    const { panel } = info;
    const baseZIndex = 10;
    
    panel.layerOrder.forEach((layerId, index) => {
        const zIndex = baseZIndex + index;
        if (layerId === 'drawing-layer') {
            editCanvas.style.zIndex = zIndex.toString();
            editCanvas.style.opacity = panel.drawingLayerOpacity.toString();
            editCanvas.style.display = panel.drawingLayerVisible ? 'block' : 'none';
        } else {
            const textElement = document.getElementById(layerId);
            if (textElement) {
                textElement.style.zIndex = zIndex.toString();
            }
        }
    });
}


// --- IMAGE EDITOR FEATURES ---

function updateImageEditorUI() {
    brushSizeSlider.value = currentBrushSettings.size.toString();
    blendModeSelect.value = currentBrushSettings.blendMode;

    brushColorInputs.forEach(input => {
        input.classList.toggle('active', input.dataset.color === currentBrushSettings.color);
    });
    brushShapeButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.shape === currentBrushSettings.shape);
    });
}

function enterImageEditMode(sourceUrl: string) {
    isImageEditingMode = true;
    stopAutoPlay();
    resetZoomAndPan();
    readerImage.style.cursor = 'not-allowed';

    const panelInfo = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);

    const setupEditor = () => {
        // Set canvas size based on the readerImage element which is now holding our source
        editCanvas.width = readerImage.clientWidth;
        editCanvas.height = readerImage.clientHeight;
        selectionCanvas.width = readerImage.clientWidth;
        selectionCanvas.height = readerImage.clientHeight;
        
        applyLayerOrder(); // This will also make the canvas visible

        if (!editCanvasCtx) return;

        // Restore or initialize editor state
        if (panelInfo && panelInfo.panel.brushSettings && panelInfo.panel.editHistory && panelInfo.panel.editHistory.length > 0) {
            currentBrushSettings = { ...panelInfo.panel.brushSettings };
            editHistory = panelInfo.panel.editHistory;
            editHistoryIndex = panelInfo.panel.editHistoryIndex ?? editHistory.length - 1;
            
            // Draw the last saved state onto the canvas
            const lastState = editHistory[editHistoryIndex];
            editCanvasCtx.putImageData(lastState, 0, 0);
        } else {
            // First time editing: initialize state
            currentBrushSettings = {
                color: '#000000', size: 5, shape: 'round', blendMode: 'source-over'
            };
            editHistory = [];
            editHistoryIndex = -1;
            
            editCanvasCtx.drawImage(readerImage, 0, 0, editCanvas.width, editCanvas.height);
            saveEditHistory();
        }

        editCanvasCtx.lineJoin = 'round';
        editCanvasCtx.lineCap = 'round';
        
        imageEditToolbar.classList.remove('hidden');
        updateImageEditorUI();
        updateUndoRedoButtons();

        // Set initial tool to brush
        currentEditTool = 'brush';
        editCanvas.style.cursor = 'crosshair';
        eraserToggleButton.classList.remove('active');
        genFillButton.classList.remove('active');
        selectionCanvas.style.display = 'none';

        // Add unified event listeners
        editCanvas.addEventListener('mousedown', handleCanvasMouseDown);
        editCanvas.addEventListener('mousemove', handleCanvasMouseMove);
        editCanvas.addEventListener('mouseup', handleCanvasMouseUp);
        editCanvas.addEventListener('mouseleave', handleCanvasMouseUp);
        editCanvas.addEventListener('touchstart', handleCanvasMouseDown, { passive: false });
        editCanvas.addEventListener('touchmove', handleCanvasMouseMove, { passive: false });
        editCanvas.addEventListener('touchend', handleCanvasMouseUp);
    };
    
    if (imageEditContext?.type === 'character') {
        document.body.classList.add('character-edit-active');
        readerView.classList.remove('hidden');
        // Temporarily put the character image into the reader's img tag to measure it and draw it
        readerImage.onload = () => {
            setupEditor();
            readerImage.onload = null; // cleanup
        };
        readerImage.src = sourceUrl;
    } else { // Panel editing
        // Image is already loaded in readerImage
        setupEditor();
    }
}

function exitImageEditMode(saveChanges: boolean) {
    const wasCharacterEdit = imageEditContext?.type === 'character';
    // Get the original panel source *before* we potentially change it by opening another character sheet
    const originalPanelSrc = getPanelInfoByGlobalIndex(currentGlobalPanelIndex)?.panel.imageSrc;
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);


    if (saveChanges && imageEditContext) {
        if (imageEditContext.type === 'panel' && info) {
            const newImageSrc = editCanvas.toDataURL('image/jpeg');
            info.panel.imageSrc = newImageSrc;
            
            // Save editor state
            info.panel.brushSettings = { ...currentBrushSettings };
            info.panel.editHistory = [...editHistory];
            info.panel.editHistoryIndex = editHistoryIndex;

            readerImage.src = newImageSrc;
            const gridPanel = mangaContainer.querySelector(`.manga-panel[data-global-index="${currentGlobalPanelIndex}"]`);
            if (gridPanel) {
                const gridImg = gridPanel.querySelector('img');
                if (gridImg) gridImg.src = newImageSrc;
            }
            const thumbnail = readerThumbnailContainer.querySelector(`.reader-thumbnail[data-global-index="${currentGlobalPanelIndex}"]`);
            if (thumbnail) (thumbnail as HTMLImageElement).src = newImageSrc;
            saveStoryToLocalStorage();
        } else if (imageEditContext.type === 'character' && imageEditContext.index !== undefined) {
             const char = currentStoryData?.characterSheet[imageEditContext.index];
             if (char) {
                 const newImageSrc = editCanvas.toDataURL('image/jpeg');
                 char.artSrc = newImageSrc;
                 saveStoryToLocalStorage();
             }
        }
    }
    
    isImageEditingMode = false;
    editCanvas.style.display = 'none';
    selectionCanvas.style.display = 'none';
    
    editHistory = [];
    editHistoryIndex = -1;
    updateUndoRedoButtons();
    clearSelection();

    // Remove unified event listeners
    editCanvas.removeEventListener('mousedown', handleCanvasMouseDown);
    editCanvas.removeEventListener('mousemove', handleCanvasMouseMove);
    editCanvas.removeEventListener('mouseup', handleCanvasMouseUp);
    editCanvas.removeEventListener('mouseleave', handleCanvasMouseUp);
    editCanvas.removeEventListener('touchstart', handleCanvasMouseDown);
    editCanvas.removeEventListener('touchmove', handleCanvasMouseMove);
    editCanvas.removeEventListener('touchend', handleCanvasMouseUp);
    
    if (wasCharacterEdit) {
        document.body.classList.remove('character-edit-active');
        readerView.classList.add('hidden');
        // Restore the readerImage's original source in case the reader was open before editing
        if (originalPanelSrc) {
            readerImage.src = originalPanelSrc;
        }
        openCharacterSheetModal(); // Re-open to show updated image
    } else {
        imageEditToolbar.classList.add('hidden');
        readerImage.style.cursor = 'zoom-in';
    }
    imageEditContext = null; // Reset context
}

// --- Image Editor Event Handlers ---

function handleCanvasMouseDown(e: MouseEvent | TouchEvent) {
    if (currentEditTool === 'brush' || currentEditTool === 'eraser') {
        startDrawing(e);
    } else if (currentEditTool === 'gen-fill') {
        startSelection(e);
    }
}

function handleCanvasMouseMove(e: MouseEvent | TouchEvent) {
    if (currentEditTool === 'brush' || currentEditTool === 'eraser') {
        draw(e);
    } else if (currentEditTool === 'gen-fill') {
        drawSelection(e);
    }
}

function handleCanvasMouseUp() {
    if (currentEditTool === 'brush' || currentEditTool === 'eraser') {
        stopDrawing();
    } else if (currentEditTool === 'gen-fill') {
        endSelection();
    }
}

// --- Brush/Eraser Logic ---

/** Helper function to draw stamped shapes like stars and triangles. */
function drawStampedShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: 'star' | 'triangle') {
    ctx.beginPath();
    const radius = size / 2;

    if (shape === 'triangle') {
        // Equilateral triangle centered at (x, y)
        const height = radius * 2;
        const side = height * 2 / Math.sqrt(3);
        const triangleHeight = side * Math.sqrt(3) / 2;
        ctx.moveTo(x, y - triangleHeight / 2);
        ctx.lineTo(x - side / 2, y + triangleHeight / 2);
        ctx.lineTo(x + side / 2, y + triangleHeight / 2);
    } else if (shape === 'star') {
        const spikes = 5;
        const outerRadius = radius;
        const innerRadius = radius / 2.5; // Controls how 'pointy' the star is
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        
        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            let cx = x + Math.cos(rot) * outerRadius;
            let cy = y + Math.sin(rot) * outerRadius;
            ctx.lineTo(cx, cy);
            rot += step;

            cx = x + Math.cos(rot) * innerRadius;
            cy = y + Math.sin(rot) * innerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
        }
    }
    
    ctx.closePath();
    ctx.fill();
}


function startDrawing(e: MouseEvent | TouchEvent) {
    isDrawing = true;
    hasDrawnOnMove = false;
    const rect = editCanvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    [lastX, lastY] = [clientX - rect.left, clientY - rect.top];
}

function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing || !editCanvasCtx) return;
    hasDrawnOnMove = true;
    
    const rect = editCanvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    editCanvasCtx.strokeStyle = currentBrushSettings.color;
    editCanvasCtx.fillStyle = currentBrushSettings.color;
    editCanvasCtx.lineWidth = currentBrushSettings.size;
    editCanvasCtx.globalCompositeOperation = currentEditTool === 'eraser' 
        ? 'destination-out' 
        : currentBrushSettings.blendMode;

    switch (currentBrushSettings.shape) {
        case 'spray':
            for (let i = 0; i < 40; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * currentBrushSettings.size;
                editCanvasCtx.fillRect(x + radius * Math.cos(angle), y + radius * Math.sin(angle), 1, 1);
            }
            break;
        case 'star':
        case 'triangle':
            const dist = Math.hypot(x - lastX, y - lastY);
            const angle = Math.atan2(y - lastY, x - lastY);
            const step = Math.max(1, currentBrushSettings.size / 3); // Density
            for (let i = 0; i < dist; i += step) {
                const newX = lastX + Math.cos(angle) * i;
                const newY = lastY + Math.sin(angle) * i;
                drawStampedShape(editCanvasCtx, newX, newY, currentBrushSettings.size, currentBrushSettings.shape);
            }
            // Also draw the final point to ensure the end of the stroke is rendered
            drawStampedShape(editCanvasCtx, x, y, currentBrushSettings.size, currentBrushSettings.shape);
            break;
        case 'round':
        case 'square':
        default:
            editCanvasCtx.lineCap = currentBrushSettings.shape as CanvasLineCap;
            editCanvasCtx.beginPath();
            editCanvasCtx.moveTo(lastX, lastY);
            editCanvasCtx.lineTo(x, y);
            editCanvasCtx.stroke();
            break;
    }
    
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    if (!isDrawing) return;

    // Handle a single-click draw if no mousemove occurred
    if (!hasDrawnOnMove && editCanvasCtx) {
        editCanvasCtx.strokeStyle = currentBrushSettings.color;
        editCanvasCtx.fillStyle = currentBrushSettings.color;
        editCanvasCtx.lineWidth = currentBrushSettings.size;
        editCanvasCtx.globalCompositeOperation = currentEditTool === 'eraser' 
            ? 'destination-out' 
            : currentBrushSettings.blendMode;

        switch (currentBrushSettings.shape) {
            case 'spray':
                for (let i = 0; i < 40; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * currentBrushSettings.size;
                    editCanvasCtx.fillRect(lastX + radius * Math.cos(angle), lastY + radius * Math.sin(angle), 1, 1);
                }
                break;
            case 'star':
            case 'triangle':
                drawStampedShape(editCanvasCtx, lastX, lastY, currentBrushSettings.size, currentBrushSettings.shape);
                break;
            case 'round':
            case 'square':
            default:
                editCanvasCtx.lineCap = currentBrushSettings.shape as CanvasLineCap;
                editCanvasCtx.beginPath();
                // Draw a tiny line to simulate a point, respecting lineCap
                editCanvasCtx.moveTo(lastX, lastY);
                editCanvasCtx.lineTo(lastX, lastY);
                editCanvasCtx.stroke();
                break;
        }
    }
    
    isDrawing = false;
    saveEditHistory();
}

// --- Generative Fill Logic ---

function startSelection(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    isSelecting = true;
    const rect = editCanvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    selectionStartPos = { x: clientX - rect.left, y: clientY - rect.top };
}

function drawSelection(e: MouseEvent | TouchEvent) {
    if (!isSelecting || !selectionCtx) return;
    e.preventDefault();
    const rect = editCanvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    const x = Math.min(selectionStartPos.x, currentX);
    const y = Math.min(selectionStartPos.y, currentY);
    const width = Math.abs(currentX - selectionStartPos.x);
    const height = Math.abs(currentY - selectionStartPos.y);
    selectionRect = { x, y, width, height };

    selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    selectionCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    selectionCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    selectionCtx.lineWidth = 2;
    selectionCtx.setLineDash([6, 4]);
    selectionCtx.strokeRect(x, y, width, height);
    selectionCtx.fillRect(x, y, width, height);
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    if (selectionRect.width > 5 && selectionRect.height > 5) {
        openGenFillModal();
    } else {
        clearSelection();
    }
}

function clearSelection() {
    selectionRect = { x: 0, y: 0, width: 0, height: 0 };
    selectionCtx?.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
}

function openGenFillModal() {
    genFillModal.classList.remove('hidden');
    genFillPromptInput.focus();
    genFillPromptInput.value = '';
    genFillError.style.display = 'none';
}

function closeGenFillModal() {
    genFillModal.classList.add('hidden');
    clearSelection();
}

async function handleGenFillGenerate() {
    const prompt = genFillPromptInput.value.trim();
    if (!prompt) {
        genFillError.textContent = 'Please enter a prompt.';
        genFillError.style.display = 'block';
        return;
    }
    
    genFillLoader.classList.remove('hidden');
    genFillError.style.display = 'none';
    genFillGenerateButton.disabled = true;

    try {
        // 1. Create masked image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = editCanvas.width;
        tempCanvas.height = editCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) throw new Error("Could not create temp canvas context.");

        tempCtx.drawImage(editCanvas, 0, 0);
        // Create a semi-transparent black mask over the selection
        tempCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        tempCtx.fillRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
        
        const maskedImageBase64 = tempCanvas.toDataURL('image/jpeg').split(',')[1];

        // 2. Prepare API call
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: maskedImageBase64 } };
        const textPart = { text: `In the semi-transparent masked area, generate: ${prompt}. The rest of the image should remain unchanged and the art style should be consistent.` };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        // 3. Process response
        const imageResponsePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (!imageResponsePart || !imageResponsePart.inlineData) {
            throw new Error('No image was returned from the API.');
        }

        const newImageBase64 = imageResponsePart.inlineData.data;
        const newImageUrl = `data:image/png;base64,${newImageBase64}`;

        // 4. Update canvas
        await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                editCanvasCtx?.drawImage(img, 0, 0, editCanvas.width, editCanvas.height);
                saveEditHistory();
                closeGenFillModal();
                resolve();
            };
            img.onerror = () => reject(new Error('Failed to load generated image.'));
            img.src = newImageUrl;
        });

    } catch (error) {
        console.error('Generative fill failed:', error);
        genFillError.textContent = 'Failed to generate fill. Please try again.';
        genFillError.style.display = 'block';
    } finally {
        genFillLoader.classList.add('hidden');
        genFillGenerateButton.disabled = false;
    }
}

// --- Editor History ---

function saveEditHistory() {
    if (!editCanvasCtx) return;
    // If we have "undone" and then draw, we clear the "redo" history
    editHistory.splice(editHistoryIndex + 1); 
    const imageData = editCanvasCtx.getImageData(0, 0, editCanvas.width, editCanvas.height);
    editHistory.push(imageData);
    // Limit history size
    if (editHistory.length > 30) {
        editHistory.shift(); 
    }
    editHistoryIndex = editHistory.length - 1;
    updateUndoRedoButtons();
}

function undoEdit() {
    if (editHistoryIndex > 0) {
        editHistoryIndex--;
        const imageData = editHistory[editHistoryIndex];
        editCanvasCtx?.putImageData(imageData, 0, 0);
        updateUndoRedoButtons();
    }
}

function redoEdit() {
    if (editHistoryIndex < editHistory.length - 1) {
        editHistoryIndex++;
        const imageData = editHistory[editHistoryIndex];
        editCanvasCtx?.putImageData(imageData, 0, 0);
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    undoButton.disabled = editHistoryIndex <= 0;
    redoButton.disabled = editHistoryIndex >= editHistory.length - 1;
}

function handleDeletePanel() {
    if (!confirm('Are you sure you want to delete this panel? This action cannot be undone.')) {
        return;
    }
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    mangaCache[info.chapterIndex].panelCache.splice(info.panelIndexInChapter, 1);
    mangaCache = mangaCache.filter(c => c.panelCache.length > 0); // Remove empty chapters
    if (currentStoryData) {
        currentStoryData.chapters[info.chapterIndex].panels.splice(info.panelIndexInChapter, 1);
        currentStoryData.chapters = currentStoryData.chapters.filter(c => c.panels.length > 0);
    }
    
    renderMangaGrid();

    if (getTotalPanelCount() === 0) {
        closeReader();
        resetApp();
        return;
    }
    
    if (currentGlobalPanelIndex >= getTotalPanelCount()) {
        currentGlobalPanelIndex = getTotalPanelCount() - 1;
    }

    updateReaderUI();
    saveStoryToLocalStorage();
}

// --- CHARACTER SHEET ---

function openCharacterSheetModal() {
    if (!currentStoryData) return;
    characterSheetModal.classList.remove('hidden');
    renderCharacterList();
    if (currentStoryData.characterSheet.length > 0) {
        // If a character was being edited, re-select them. Otherwise, select the first one.
        selectCharacterForEditing(currentlyEditingCharacterIndex ?? 0);
    }
}

function closeCharacterSheetModal() {
    characterSheetModal.classList.add('hidden');
    currentlyEditingCharacterIndex = null;
}

function renderCharacterList() {
    if (!currentStoryData) return;
    characterList.innerHTML = '';
    currentStoryData.characterSheet.forEach((char, index) => {
        const li = document.createElement('li');
        li.className = 'character-list-item';
        li.dataset.characterIndex = index.toString();
        li.onclick = () => selectCharacterForEditing(index);

        const img = document.createElement('img');
        img.src = char.artSrc || placeholderImageSrc;
        img.alt = `${char.name} thumbnail`;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = char.name;

        li.appendChild(img);
        li.appendChild(nameSpan);
        characterList.appendChild(li);
    });
}

function selectCharacterForEditing(index: number) {
    if (!currentStoryData || !currentStoryData.characterSheet[index]) return;

    currentlyEditingCharacterIndex = index;

    // Update active class in list
    characterList.querySelectorAll<HTMLLIElement>('.character-list-item').forEach(item => {
        item.classList.toggle('active', item.dataset.characterIndex === index.toString());
    });

    const character = currentStoryData.characterSheet[index];
    characterNameInput.value = character.name;
    characterDescriptionTextarea.value = character.description;

    if (character.artSrc) {
        characterArtImage.src = character.artSrc;
        characterArtImage.classList.remove('hidden');
        characterArtPlaceholder.classList.add('hidden');
        generateCharacterArtButton.textContent = 'Regenerate';
        editCharacterArtButton.classList.remove('hidden');
    } else {
        characterArtImage.src = '';
        characterArtImage.classList.add('hidden');
        characterArtPlaceholder.classList.remove('hidden');
        generateCharacterArtButton.textContent = 'Generate Portrait';
        editCharacterArtButton.classList.add('hidden');
    }
}

function saveCharacterChanges() {
    if (currentlyEditingCharacterIndex === null || !currentStoryData) return;
    
    const character = currentStoryData.characterSheet[currentlyEditingCharacterIndex];
    character.name = characterNameInput.value;
    character.description = characterDescriptionTextarea.value;

    renderCharacterList(); // Update name in the list
    selectCharacterForEditing(currentlyEditingCharacterIndex); // Re-select to maintain active state
    saveStoryToLocalStorage();
}

async function generateCharacterPortrait() {
    if (currentlyEditingCharacterIndex === null || !currentStoryData) return;

    characterArtLoader.classList.remove('hidden');
    generateCharacterArtButton.disabled = true;
    editCharacterArtButton.disabled = true;

    try {
        const character = currentStoryData.characterSheet[currentlyEditingCharacterIndex];
        const imagePrompt = `Full-body character portrait, clean white background, professional manga art.
            Art Style: "${currentStoryData.styleGuide}".
            Character Details: "${character.description}".
            Focus on creating a definitive character reference sheet image.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '1:1',
                outputMimeType: 'image/jpeg',
            },
        });
        
        const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
        if (!imageBytes) {
            throw new Error('Character art generation returned no data.');
        }

        const initialImageSrc = `data:image/jpeg;base64,${imageBytes}`;
        const upscaledImageSrc = await upscaleImage(initialImageSrc, 1024, 1024);

        character.artSrc = upscaledImageSrc;
        saveStoryToLocalStorage();
        renderCharacterList();
        selectCharacterForEditing(currentlyEditingCharacterIndex);

    } catch (error) {
        console.error('Failed to generate character portrait:', error);
        alert('Failed to generate portrait. Please try again.');
    } finally {
        characterArtLoader.classList.add('hidden');
        generateCharacterArtButton.disabled = false;
        editCharacterArtButton.disabled = false;
    }
}

// --- STORY CONTINUATION ---

function openContinueStoryModal() {
    continueStoryModal.classList.remove('hidden');
    continuePromptInput.value = '';
    continueError.style.display = 'none';
    continueLoader.classList.add('hidden');
    continueGenerateButton.disabled = false;
    continuePromptInput.focus();
}

function closeContinueStoryModal() {
    continueStoryModal.classList.add('hidden');
}

async function handleContinueStory() {
    if (!currentStoryData) return;

    const continuationPrompt = continuePromptInput.value.trim();
    const chapterCount = parseInt(continueChapterCountInput.value, 10);
    const panelsPerChapter = parseInt(continuePanelsPerChapterInput.value, 10);

    if (!continuationPrompt || isNaN(chapterCount) || isNaN(panelsPerChapter) || chapterCount < 1 || panelsPerChapter < 1) {
        continueError.textContent = 'Please enter a valid prompt and numbers.';
        continueError.style.display = 'block';
        return;
    }

    continueLoader.classList.remove('hidden');
    continueError.style.display = 'none';
    continueGenerateButton.disabled = true;

    try {
        const lastChapter = currentStoryData.chapters[currentStoryData.chapters.length - 1];
        const storyContext = `
            The story so far is based on the idea: "${currentStoryData.originalPrompt}".
            The last chapter was titled "${lastChapter.title}" and the final panel had the dialogue: "${lastChapter.panels[lastChapter.panels.length - 1].dialogue}".
            Now, continue the story based on this new direction: "${continuationPrompt}".
            
            Use the existing style guide: "${currentStoryData.styleGuide}"
            And the existing character sheet: ${JSON.stringify(currentStoryData.characterSheet)}
            
            Generate ${chapterCount} new chapters, each with ${panelsPerChapter} panels. Ensure the new chapter titles are unique and follow the existing narrative arc.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: storyContext,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        chapters: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    panels: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                panel: { type: Type.NUMBER },
                                                description: { type: Type.STRING },
                                                dialogue: { type: Type.STRING },
                                            },
                                            required: ['panel', 'description', 'dialogue'],
                                        },
                                    },
                                },
                                required: ['title', 'panels'],
                            },
                        },
                    },
                    required: ['chapters'],
                }
            }
        });

        const { chapters: newChapters } = JSON.parse(response.text);

        const startingPanelCount = getTotalPanelCount();
        currentStoryData.chapters.push(...newChapters);

        // Add new chapters to the cache as placeholders
        const newChapterCacheItems = newChapters.map((chapter: Chapter, chapIdx: number) => ({
            id: `chapter-${Date.now()}-${currentStoryData!.chapters.length + chapIdx}`,
            title: chapter.title,
            // Add explicit return type to map callback to ensure correct type inference for `filter`.
            panelCache: chapter.panels.map((panel: MangaPanelStory, pIdx: number): PanelCacheItem => ({
                id: `panel-${Date.now()}-${currentStoryData!.chapters.length + chapIdx}-${pIdx}`,
                imageSrc: placeholderImageSrc,
                panelData: panel,
                isPlaceholder: true,
                filter: 'none',
                blur: 0,
                textOverlays: [],
                filterIntensities: { grayscale: 0, sepia: 0, invert: 0, sketch: 0 },
                layerOrder: ['drawing-layer'],
                drawingLayerOpacity: 1,
                drawingLayerVisible: true,
            }))
        }));
        mangaCache.push(...newChapterCacheItems);

        closeContinueStoryModal();
        setLoading(true);
        renderMangaGrid(); // Re-render with new placeholders

        await generateImagesForChapters(newChapters, startingPanelCount);

        saveStoryToLocalStorage();
        setupContinueState(); // Refresh buttons
        setLoading(false);

    } catch (error) {
        console.error("Failed to continue story:", error);
        continueError.textContent = 'Failed to generate new chapters. Please try again.';
        continueError.style.display = 'block';
    } finally {
        continueLoader.classList.add('hidden');
        continueGenerateButton.disabled = false;
    }
}

// --- PANEL LINKING ---

function toggleLinkingMode() {
    isLinkingPanel = !isLinkingPanel;
    readerView.classList.toggle('linking-active', isLinkingPanel);
    linkPanelButton.classList.toggle('active', isLinkingPanel);

    if (isLinkingPanel) {
        linkingSourcePanelIndex = currentGlobalPanelIndex;
        const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
        if (info && info.panel.customNextPanelIndex !== undefined) {
            // If already linked, clicking again clears the link
            delete info.panel.customNextPanelIndex;
            saveStoryToLocalStorage();
            updateReaderUI();
            toggleLinkingMode(); // Exit immediately
        }
    } else {
        linkingSourcePanelIndex = null;
    }
}

function createPanelLink(targetGlobalIndex: number) {
    if (linkingSourcePanelIndex === null) return;
    const sourceInfo = getPanelInfoByGlobalIndex(linkingSourcePanelIndex);
    if (!sourceInfo || linkingSourcePanelIndex === targetGlobalIndex) {
        toggleLinkingMode(); // Cancel if linking to self
        return;
    }

    sourceInfo.panel.customNextPanelIndex = targetGlobalIndex;
    saveStoryToLocalStorage();
    toggleLinkingMode(); // Exit linking mode
    updateReaderUI(); // Refresh UI to show new indicators
}


// --- EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    loadUserSettings();
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    checkForSavedStory();
});

mangaForm.addEventListener('submit', handleMangaFormSubmit);
startOverButton.addEventListener('click', resetApp);
continueLastButton.addEventListener('click', loadAndSetupLastStory);
viewCharacterSheetButton.addEventListener('click', openCharacterSheetModal);
viewStoryboardCharacterSheetButton.addEventListener('click', openCharacterSheetModal);


generateImagesButton.addEventListener('click', startImageGenerationFromStoryboard);
storyboardSaveButton.addEventListener('click', saveStoryboardEdit);
storyboardCancelButton.addEventListener('click', closeStoryboardEditModal);
storyboardCloseModalButton.addEventListener('click', closeStoryboardEditModal);

exportImagesButton.addEventListener('click', exportAsImages);
exportGifButton.addEventListener('click', exportAsGif);

closeReaderButton.addEventListener('click', closeReader);
prevButton.addEventListener('click', showPrevPanel);
nextButton.addEventListener('click', showNextPanel);
prevChapterButton.addEventListener('click', showPrevChapter);
nextChapterButton.addEventListener('click', showNextChapter);
shareButton.addEventListener('click', shareMangaPanel);
musicToggleButton.addEventListener('click', toggleMusic);
sfxToggleButton.addEventListener('click', toggleSfx);
narrationToggleButton.addEventListener('click', toggleNarration);
playPauseButton.addEventListener('click', toggleAutoPlay);
regenerateImageButton.addEventListener('click', openRegenerationModal);
editDialogueButton.addEventListener('click', () => isEditingDialogue ? cancelDialogueEdit() : startDialogueEdit());
dialogueSaveButton.addEventListener('click', saveDialogueEdit);
dialogueCancelButton.addEventListener('click', cancelDialogueEdit);
dialogueEditTextarea.addEventListener('input', () => {
    dialogueEditTextarea.style.height = 'auto';
    dialogueEditTextarea.style.height = `${dialogueEditTextarea.scrollHeight}px`;
});
filterButton.addEventListener('click', () => {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (info) {
        const { panel } = info;
        blurSlider.value = panel.blur.toString();
        blurValue.textContent = panel.blur.toString();
        grayscaleSlider.value = panel.filterIntensities.grayscale.toString();
        grayscaleValue.textContent = panel.filterIntensities.grayscale.toString();
        sepiaSlider.value = panel.filterIntensities.sepia.toString();
        sepiaValue.textContent = panel.filterIntensities.sepia.toString();
        invertSlider.value = panel.filterIntensities.invert.toString();
        invertValue.textContent = panel.filterIntensities.invert.toString();
        sketchSlider.value = panel.filterIntensities.sketch.toString();
        sketchValue.textContent = panel.filterIntensities.sketch.toString();
    }
    filterOptions.classList.toggle('hidden');
});
addTextButton.addEventListener('click', () => openTextEditor());
deletePanelButton.addEventListener('click', handleDeletePanel);
readerSearchInput.addEventListener('input', applyReaderSearchAndFilter);
readerFilterToggles.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;
    if (target.matches('button[data-filter-type]')) {
        target.classList.toggle('active');
        applyReaderSearchAndFilter();
    }
});
readerClearFilterButton.addEventListener('click', resetReaderSearchAndFilter);

speedSelect.addEventListener('change', () => { userSettings.narrationSpeed = parseFloat(speedSelect.value); saveUserSettings(); });
voiceSelect.addEventListener('change', () => { userSettings.narrationVoiceName = voiceSelect.value; saveUserSettings(); });
musicVolumeSlider.addEventListener('input', () => {
    const volume = parseFloat(musicVolumeSlider.value);
    userSettings.musicVolume = volume;
    readerAudio.volume = volume;
    saveUserSettings();
});
sfxVolumeSlider.addEventListener('input', () => {
    const volume = parseFloat(sfxVolumeSlider.value);
    userSettings.sfxVolume = volume;
    sfxAudio.volume = volume;
    saveUserSettings();
});

readerImage.addEventListener('mousedown', handlePanStart);
readerImage.addEventListener('mousemove', handlePanMove);
readerImage.addEventListener('mouseup', handlePanEnd);
readerImage.addEventListener('mouseleave', handlePanEnd);
readerImage.addEventListener('click', handleImageClick);
readerImage.addEventListener('touchstart', handlePanStart, { passive: false });
readerImage.addEventListener('touchmove', handlePanMove, { passive: false });
readerImage.addEventListener('touchend', handlePanEnd);
readerImage.addEventListener('touchcancel', handlePanEnd);
readerImage.addEventListener('touchend', handleImageTouch);

closeModalButton.addEventListener('click', closeRegenerationModal);
modalRegenerateButton.addEventListener('click', handleRegenerateImage);
modalCancelButton.addEventListener('click', closeRegenerationModal);

closeGenFillModalButton.addEventListener('click', closeGenFillModal);
genFillGenerateButton.addEventListener('click', handleGenFillGenerate);
genFillCancelButton.addEventListener('click', closeGenFillModal);

filterOptions.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;
    if (target.matches('button[data-filter]')) {
        const filter = target.dataset.filter as FilterType;
        if (filter) applyFilter(filter);
    }
});
clearAllFiltersButton.addEventListener('click', handleClearAllFilters);
blurSlider.addEventListener('input', () => {
    const value = parseFloat(blurSlider.value);
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (info) {
        info.panel.blur = value;
        blurValue.textContent = value.toString();
        applyAllCurrentFilters();
        saveStoryToLocalStorage();
    }
});
filterIntensitySliders.forEach(slider => {
    slider.addEventListener('input', () => {
        const value = parseInt(slider.value, 10);
        const filter = slider.dataset.filter as keyof PanelCacheItem['filterIntensities'];
        const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);

        if (info && filter) {
            info.panel.filterIntensities[filter] = value;
            (document.getElementById(`${filter}-value`) as HTMLSpanElement).textContent = value.toString();
            applyAllCurrentFilters();
            saveStoryToLocalStorage();
        }
    });
});


// Refactored listeners for real-time layer control updates
textLayerControls.addEventListener('input', updateTextOverlayFromEditor);
textLayerControls.addEventListener('change', updateTextOverlayFromEditor); // For selects, color pickers etc.

drawingLayerOpacity.addEventListener('input', () => {
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if(info) {
        info.panel.drawingLayerOpacity = parseFloat(drawingLayerOpacity.value);
        applyLayerOrder();
        saveStoryToLocalStorage();
    }
});

alignmentControls.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('button');
    if (target) {
        alignmentControls.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        updateTextOverlayFromEditor();
    }
});
textDecorationControls.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('button');
    if (target) {
        target.classList.toggle('active');
        updateTextOverlayFromEditor();
    }
});
textOverlayCloseButton.addEventListener('click', closeTextEditor);
textOverlayDeleteButton.addEventListener('click', deleteTextOverlay);

/** Helper to clear all visual drop indicators from layer items. */
function clearLayerDropIndicators() {
    textOverlayLayerList.querySelectorAll('.layer-item').forEach(item => {
        item.classList.remove('drop-indicator-before', 'drop-indicator-after');
    });
}

textOverlayLayerList.addEventListener('dragstart', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLLIElement>('.layer-item');
    if (target) {
        draggedLayerItem = target;
        setTimeout(() => target.classList.add('dragging'), 0);
    }
});

textOverlayLayerList.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!draggedLayerItem) return;

    const target = (e.target as HTMLElement).closest<HTMLLIElement>('.layer-item');
    
    // Clear all indicators first for simplicity and to handle moving between items
    clearLayerDropIndicators();

    if (target && target !== draggedLayerItem) {
        const rect = target.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        if (e.clientY < midpoint) {
            target.classList.add('drop-indicator-before');
        } else {
            target.classList.add('drop-indicator-after');
        }
    }
});

textOverlayLayerList.addEventListener('dragleave', (e) => {
    // Clear indicators if the mouse leaves the list container entirely
    if (!textOverlayLayerList.contains(e.relatedTarget as Node)) {
        clearLayerDropIndicators();
    }
});

textOverlayLayerList.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedLayerItem) return;

    const target = (e.target as HTMLElement).closest<HTMLLIElement>('.layer-item');
    
    // Find where to drop and update the DOM
    if (target && target !== draggedLayerItem) {
        const rect = target.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        if (e.clientY < midpoint) {
            textOverlayLayerList.insertBefore(draggedLayerItem, target);
        } else {
            textOverlayLayerList.insertBefore(draggedLayerItem, target.nextSibling);
        }
    }

    clearLayerDropIndicators();

    // Update the data model from the new DOM order
    const info = getPanelInfoByGlobalIndex(currentGlobalPanelIndex);
    if (!info) return;

    const newLayerOrder = Array.from(textOverlayLayerList.querySelectorAll<HTMLLIElement>('.layer-item'))
        .map(li => li.dataset.layerId!)
        .reverse(); // The list is displayed visually top-to-bottom, so we reverse it back for the data model

    info.panel.layerOrder = newLayerOrder;
    
    applyLayerOrder();
    saveStoryToLocalStorage();
});

textOverlayLayerList.addEventListener('dragend', () => {
    if (draggedLayerItem) {
        draggedLayerItem.classList.remove('dragging');
    }
    draggedLayerItem = null;
    clearLayerDropIndicators();
});


editImageButton.addEventListener('click', () => {
    imageEditContext = { type: 'panel' };
    enterImageEditMode(readerImage.src);
});
editSaveButton.addEventListener('click', () => exitImageEditMode(true));
editCancelButton.addEventListener('click', () => exitImageEditMode(false));

brushSizeSlider.addEventListener('input', () => { currentBrushSettings.size = parseInt(brushSizeSlider.value, 10); });
eraserToggleButton.addEventListener('click', () => {
    const isNowErasing = currentEditTool !== 'eraser';
    currentEditTool = isNowErasing ? 'eraser' : 'brush';
    eraserToggleButton.classList.toggle('active', isNowErasing);
    genFillButton.classList.remove('active');
    editCanvas.style.cursor = 'crosshair';
    selectionCanvas.style.display = 'none';
    clearSelection();
    blendModeSelect.disabled = isNowErasing;
    brushShapeButtons.forEach(button => { button.disabled = isNowErasing; });
});
genFillButton.addEventListener('click', () => {
    currentEditTool = 'gen-fill';
    genFillButton.classList.add('active');
    eraserToggleButton.classList.remove('active');
    editCanvas.style.cursor = 'crosshair';
    selectionCanvas.style.display = 'block';
});
brushColorInputs.forEach(input => {
    input.addEventListener('click', () => {
        brushColorInputs.forEach(i => i.classList.remove('active'));
        input.classList.add('active');
        currentBrushSettings.color = input.dataset.color!;
    });
});
brushShapeButtons.forEach(button => {
    button.addEventListener('click', () => {
        brushShapeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentBrushSettings.shape = button.dataset.shape as BrushShape;
    });
});
blendModeSelect.addEventListener('change', () => {
    currentBrushSettings.blendMode = blendModeSelect.value as GlobalCompositeOperation;
});
undoButton.addEventListener('click', undoEdit);
redoButton.addEventListener('click', redoEdit);

characterSheetCloseButton.addEventListener('click', closeCharacterSheetModal);
generateCharacterArtButton.addEventListener('click', generateCharacterPortrait);
saveCharacterChangesButton.addEventListener('click', saveCharacterChanges);
editCharacterArtButton.addEventListener('click', () => {
    if (currentlyEditingCharacterIndex === null || !currentStoryData) return;
    const character = currentStoryData.characterSheet[currentlyEditingCharacterIndex];
    if (character.artSrc) {
        imageEditContext = { type: 'character', index: currentlyEditingCharacterIndex };
        closeCharacterSheetModal(); // Close it first
        enterImageEditMode(character.artSrc);
    }
});

continueStoryButton.addEventListener('click', openContinueStoryModal);
continueCancelButton.addEventListener('click', closeContinueStoryModal);
continueGenerateButton.addEventListener('click', handleContinueStory);
linkPanelButton.addEventListener('click', toggleLinkingMode);

document.addEventListener('keydown', (e) => {
    if (!readerView.classList.contains('hidden')) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || isEditingDialogue) return;
        switch (e.key) {
            case 'ArrowRight': showNextPanel(); break;
            case 'ArrowLeft': showPrevPanel(); break;
            case 'Escape': closeReader(); break;
            case ' ': e.preventDefault(); toggleAutoPlay(); break;
        }
    }
});