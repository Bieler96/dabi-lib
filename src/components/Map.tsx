"use client";

import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useId,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
	Compass,
	LocateFixed,
	Maximize,
	Minus,
	Plus,
	RotateCcw,
} from "lucide-react";
import MapLibreGL, {
	type GeoJSONSource,
	type MapOptions,
	type MarkerOptions,
	type PopupOptions,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { cn } from "../utils/cn";

const defaultStyles = {
	dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
	light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

type Theme = "light" | "dark";

type MapViewport = {
	center: [number, number];
	zoom: number;
	bearing: number;
	pitch: number;
};

type MapStyleOption = string | MapLibreGL.StyleSpecification;
type MapRef = MapLibreGL.Map;

type MapContextValue = {
	map: MapLibreGL.Map | null;
	isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error("useMap must be used within a Map component");
	}

	return context;
}

function getDocumentTheme(): Theme | null {
	if (typeof document === "undefined") return null;
	if (document.documentElement.classList.contains("dark")) return "dark";
	if (document.documentElement.classList.contains("light")) return "light";
	return null;
}

function getSystemTheme(): Theme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function useResolvedTheme(theme?: Theme) {
	const [detectedTheme, setDetectedTheme] = useState<Theme>(
		() => getDocumentTheme() ?? getSystemTheme(),
	);

	useEffect(() => {
		if (theme) return;

		const observer = new MutationObserver(() => {
			const documentTheme = getDocumentTheme();
			if (documentTheme) setDetectedTheme(documentTheme);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemChange = (event: MediaQueryListEvent) => {
			if (!getDocumentTheme())
				setDetectedTheme(event.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handleSystemChange);

		return () => {
			observer.disconnect();
			mediaQuery.removeEventListener("change", handleSystemChange);
		};
	}, [theme]);

	return theme ?? detectedTheme;
}

function getViewport(map: MapLibreGL.Map): MapViewport {
	const center = map.getCenter();

	return {
		center: [center.lng, center.lat],
		zoom: map.getZoom(),
		bearing: map.getBearing(),
		pitch: map.getPitch(),
	};
}

type MapProps = {
	children?: ReactNode;
	className?: string;
	theme?: Theme;
	styles?: {
		light?: MapStyleOption;
		dark?: MapStyleOption;
	};
	projection?: MapLibreGL.ProjectionSpecification;
	viewport?: Partial<MapViewport>;
	onViewportChange?: (viewport: MapViewport) => void;
	loading?: boolean;
} & Omit<MapOptions, "container" | "style">;

function MapLoader() {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
			<div className="flex gap-1">
				<span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60" />
				<span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
				<span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
			</div>
		</div>
	);
}

const Map = forwardRef<MapRef, MapProps>(function Map(
	{
		children,
		className,
		theme,
		styles,
		projection,
		viewport,
		onViewportChange,
		loading = false,
		...props
	},
	ref,
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isStyleLoaded, setIsStyleLoaded] = useState(false);
	const currentStyleRef = useRef<MapStyleOption | null>(null);
	const styleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const internalUpdateRef = useRef(false);
	const resolvedTheme = useResolvedTheme(theme);
	const isControlled =
		viewport !== undefined && onViewportChange !== undefined;
	const onViewportChangeRef = useRef(onViewportChange);
	onViewportChangeRef.current = onViewportChange;

	const mapStyles = useMemo(
		() => ({
			dark: styles?.dark ?? defaultStyles.dark,
			light: styles?.light ?? defaultStyles.light,
		}),
		[styles],
	);

	useImperativeHandle(ref, () => mapInstance as MapLibreGL.Map, [
		mapInstance,
	]);

	const clearStyleTimeout = useCallback(() => {
		if (!styleTimeoutRef.current) return;
		clearTimeout(styleTimeoutRef.current);
		styleTimeoutRef.current = null;
	}, []);

	useEffect(() => {
		if (!containerRef.current) return;

		const initialStyle =
			resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
		currentStyleRef.current = initialStyle;

		const map = new MapLibreGL.Map({
			container: containerRef.current,
			style: initialStyle,
			renderWorldCopies: false,
			attributionControl: { compact: true },
			...props,
			...viewport,
		});

		const handleStyleData = () => {
			clearStyleTimeout();
			styleTimeoutRef.current = setTimeout(() => {
				setIsStyleLoaded(true);
				if (projection) map.setProjection(projection);
			}, 100);
		};
		const handleLoad = () => setIsLoaded(true);
		const handleMove = () => {
			if (internalUpdateRef.current) return;
			onViewportChangeRef.current?.(getViewport(map));
		};

		map.on("load", handleLoad);
		map.on("styledata", handleStyleData);
		map.on("move", handleMove);
		setMapInstance(map);

		return () => {
			clearStyleTimeout();
			map.off("load", handleLoad);
			map.off("styledata", handleStyleData);
			map.off("move", handleMove);
			map.remove();
			setIsLoaded(false);
			setIsStyleLoaded(false);
			setMapInstance(null);
		};
		// MapLibre owns the initial options after construction.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!mapInstance || !isControlled || !viewport) return;
		if (mapInstance.isMoving()) return;

		const current = getViewport(mapInstance);
		const next = {
			center: viewport.center ?? current.center,
			zoom: viewport.zoom ?? current.zoom,
			bearing: viewport.bearing ?? current.bearing,
			pitch: viewport.pitch ?? current.pitch,
		};

		if (
			next.center[0] === current.center[0] &&
			next.center[1] === current.center[1] &&
			next.zoom === current.zoom &&
			next.bearing === current.bearing &&
			next.pitch === current.pitch
		) {
			return;
		}

		internalUpdateRef.current = true;
		mapInstance.jumpTo(next);
		internalUpdateRef.current = false;
	}, [mapInstance, isControlled, viewport]);

	useEffect(() => {
		if (!mapInstance) return;

		const nextStyle =
			resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
		if (currentStyleRef.current === nextStyle) return;

		clearStyleTimeout();
		currentStyleRef.current = nextStyle;
		setIsStyleLoaded(false);
		mapInstance.setStyle(nextStyle, { diff: true });
	}, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout]);

	const contextValue = useMemo(
		() => ({
			map: mapInstance,
			isLoaded: isLoaded && isStyleLoaded,
		}),
		[mapInstance, isLoaded, isStyleLoaded],
	);

	return (
		<MapContext.Provider value={contextValue}>
			<div
				ref={containerRef}
				className={cn("relative h-full w-full", className)}
			>
				{(!isLoaded || loading) && <MapLoader />}
				{mapInstance && children}
			</div>
		</MapContext.Provider>
	);
});

type MapControlsProps = {
	className?: string;
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	showZoom?: boolean;
	showCompass?: boolean;
	showLocate?: boolean;
	showFullscreen?: boolean;
};

const controlPositionClasses = {
	"bottom-left": "bottom-3 left-3",
	"bottom-right": "right-3 bottom-3",
	"top-left": "top-3 left-3",
	"top-right": "top-3 right-3",
};

function MapControlButton({
	children,
	label,
	onClick,
}: {
	children: ReactNode;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			onClick={onClick}
			className="inline-flex size-8 items-center justify-center border-b border-border bg-background text-foreground transition-colors last:border-b-0 hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			{children}
		</button>
	);
}

function MapControls({
	className,
	position = "top-right",
	showZoom = true,
	showCompass = true,
	showLocate = true,
	showFullscreen = true,
}: MapControlsProps) {
	const { map } = useMap();

	return (
		<div
			className={cn(
				"absolute z-10 overflow-hidden rounded-md border bg-background shadow-sm",
				controlPositionClasses[position],
				className,
			)}
		>
			{showZoom && (
				<>
					<MapControlButton
						label="Zoom in"
						onClick={() => map?.zoomIn()}
					>
						<Plus className="size-4" />
					</MapControlButton>
					<MapControlButton
						label="Zoom out"
						onClick={() => map?.zoomOut()}
					>
						<Minus className="size-4" />
					</MapControlButton>
				</>
			)}
			{showCompass && (
				<MapControlButton
					label="Reset bearing"
					onClick={() => map?.resetNorthPitch()}
				>
					{map && Math.abs(map.getBearing()) > 1 ? (
						<RotateCcw className="size-4" />
					) : (
						<Compass className="size-4" />
					)}
				</MapControlButton>
			)}
			{showLocate && (
				<MapControlButton
					label="Locate me"
					onClick={() => {
						if (!map || typeof navigator === "undefined") return;
						navigator.geolocation.getCurrentPosition((position) => {
							map.flyTo({
								center: [
									position.coords.longitude,
									position.coords.latitude,
								],
								zoom: Math.max(map.getZoom(), 12),
							});
						});
					}}
				>
					<LocateFixed className="size-4" />
				</MapControlButton>
			)}
			{showFullscreen && (
				<MapControlButton
					label="Fullscreen"
					onClick={() => {
						const container = map?.getContainer();
						if (!container) return;
						if (document.fullscreenElement) {
							void document.exitFullscreen();
							return;
						}
						void container.requestFullscreen();
					}}
				>
					<Maximize className="size-4" />
				</MapControlButton>
			)}
		</div>
	);
}

type MarkerContextValue = {
	marker: MapLibreGL.Marker;
	map: MapLibreGL.Map | null;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
	const context = useContext(MarkerContext);
	if (!context) {
		throw new Error("Marker components must be used within MapMarker");
	}

	return context;
}

type MapMarkerProps = {
	longitude: number;
	latitude: number;
	children: ReactNode;
	onClick?: (event: MouseEvent) => void;
} & Omit<MarkerOptions, "element">;

type MapClusterMarker = {
	id?: string | number;
	longitude: number;
	latitude: number;
	title?: ReactNode;
	description?: ReactNode;
	properties?: Record<string, unknown>;
};

type MapClusterLayerProps = {
	id?: string;
	markers: MapClusterMarker[];
	clusterRadius?: number;
	clusterMaxZoom?: number;
	clusterColor?: string;
	clusterTextColor?: string;
	markerColor?: string;
	onMarkerClick?: (
		marker: MapClusterMarker,
		event: MapLibreGL.MapLayerMouseEvent,
	) => void;
	onClusterClick?: (
		clusterId: number,
		event: MapLibreGL.MapLayerMouseEvent,
	) => void;
};

function MapMarker({
	longitude,
	latitude,
	children,
	onClick,
	draggable = false,
	...markerOptions
}: MapMarkerProps) {
	const { map } = useMap();
	const onClickRef = useRef(onClick);
	onClickRef.current = onClick;

	const marker = useMemo(() => {
		const markerInstance = new MapLibreGL.Marker({
			...markerOptions,
			element: document.createElement("div"),
			draggable,
		}).setLngLat([longitude, latitude]);

		markerInstance.getElement().addEventListener("click", (event) => {
			onClickRef.current?.(event);
		});

		return markerInstance;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!map) return;

		marker.addTo(map);

		return () => {
			marker.remove();
		};
	}, [map, marker]);

	if (
		marker.getLngLat().lng !== longitude ||
		marker.getLngLat().lat !== latitude
	) {
		marker.setLngLat([longitude, latitude]);
	}

	if (marker.isDraggable() !== draggable) {
		marker.setDraggable(draggable);
	}

	return (
		<MarkerContext.Provider value={{ marker, map }}>
			{children}
		</MarkerContext.Provider>
	);
}

type MarkerContentProps = {
	children?: ReactNode;
	className?: string;
};

function MarkerContent({ children, className }: MarkerContentProps) {
	const { marker } = useMarkerContext();

	return createPortal(
		<div className={cn("relative cursor-pointer", className)}>
			{children ?? (
				<div className="size-4 rounded-full border-2 border-background bg-primary shadow-md" />
			)}
		</div>,
		marker.getElement(),
	);
}

type MarkerPopupProps = {
	children: ReactNode;
	className?: string;
} & Omit<PopupOptions, "className">;

function MarkerPopup({
	children,
	className,
	...popupOptions
}: MarkerPopupProps) {
	const { marker, map } = useMarkerContext();
	const container = useMemo(() => document.createElement("div"), []);
	const popup = useMemo(
		() =>
			new MapLibreGL.Popup({
				offset: 16,
				...popupOptions,
			})
				.setMaxWidth("none")
				.setDOMContent(container),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	useEffect(() => {
		if (!map) return;

		popup.setDOMContent(container);
		marker.setPopup(popup);

		return () => {
			marker.setPopup(null);
		};
	}, [container, map, marker, popup]);

	return createPortal(
		<div
			className={cn(
				"max-w-64 rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-md",
				className,
			)}
		>
			{children}
		</div>,
		container,
	);
}

function MapClusterLayer({
	id: providedId,
	markers,
	clusterRadius = 48,
	clusterMaxZoom = 14,
	clusterColor = "#10b981",
	clusterTextColor = "#ffffff",
	markerColor = "#10b981",
	onMarkerClick,
	onClusterClick,
}: MapClusterLayerProps) {
	const reactId = useId().replace(/:/g, "");
	const sourceId = providedId ?? `map-clusters-${reactId}`;
	const clustersLayerId = `${sourceId}-clusters`;
	const clusterCountLayerId = `${sourceId}-cluster-count`;
	const unclusteredLayerId = `${sourceId}-unclustered`;
	const { map, isLoaded } = useMap();
	const markerLookup = useMemo(
		() =>
			new globalThis.Map(
				markers.map((marker, index) => [
					String(marker.id ?? index),
					marker,
				]),
			),
		[markers],
	);
	const data = useMemo(
		() => ({
			type: "FeatureCollection" as const,
			features: markers.map((marker, index) => ({
				type: "Feature" as const,
				geometry: {
					type: "Point" as const,
					coordinates: [marker.longitude, marker.latitude],
				},
				properties: {
					...marker.properties,
					markerId: String(marker.id ?? index),
					title:
						typeof marker.title === "string"
							? marker.title
							: undefined,
					description:
						typeof marker.description === "string"
							? marker.description
							: undefined,
				},
			})),
		}),
		[markers],
	);

	useEffect(() => {
		if (!map || !isLoaded) return;

		if (!map.getSource(sourceId)) {
			map.addSource(sourceId, {
				type: "geojson",
				data,
				cluster: true,
				clusterMaxZoom,
				clusterRadius,
			});
		}

		if (!map.getLayer(clustersLayerId)) {
			map.addLayer({
				id: clustersLayerId,
				type: "circle",
				source: sourceId,
				filter: ["has", "point_count"],
				paint: {
					"circle-color": clusterColor,
					"circle-radius": [
						"step",
						["get", "point_count"],
						18,
						25,
						24,
						100,
						30,
					],
					"circle-opacity": 0.9,
					"circle-stroke-color": "#ffffff",
					"circle-stroke-width": 2,
				},
			});
		}

		if (!map.getLayer(clusterCountLayerId)) {
			map.addLayer({
				id: clusterCountLayerId,
				type: "symbol",
				source: sourceId,
				filter: ["has", "point_count"],
				layout: {
					"text-field": ["get", "point_count_abbreviated"],
					"text-size": 12,
				},
				paint: {
					"text-color": clusterTextColor,
				},
			});
		}

		if (!map.getLayer(unclusteredLayerId)) {
			map.addLayer({
				id: unclusteredLayerId,
				type: "circle",
				source: sourceId,
				filter: ["!", ["has", "point_count"]],
				paint: {
					"circle-color": markerColor,
					"circle-radius": 7,
					"circle-stroke-color": "#ffffff",
					"circle-stroke-width": 2,
				},
			});
		}

		return () => {
			for (const layerId of [
				clusterCountLayerId,
				clustersLayerId,
				unclusteredLayerId,
			]) {
				if (map.getLayer(layerId)) map.removeLayer(layerId);
			}
			if (map.getSource(sourceId)) map.removeSource(sourceId);
		};
	}, [
		clusterCountLayerId,
		clusterColor,
		clusterMaxZoom,
		clusterRadius,
		clustersLayerId,
		clusterTextColor,
		data,
		isLoaded,
		map,
		markerColor,
		sourceId,
		unclusteredLayerId,
	]);

	useEffect(() => {
		if (!map || !isLoaded) return;
		const source = map.getSource(sourceId) as GeoJSONSource | undefined;
		source?.setData(data as GeoJSON.FeatureCollection);
	}, [data, isLoaded, map, sourceId]);

	useEffect(() => {
		if (!map || !isLoaded) return;

		const handleClusterClick = (event: MapLibreGL.MapLayerMouseEvent) => {
			const feature = event.features?.[0];
			const clusterId = Number(feature?.properties?.cluster_id);
			const coordinates = (
				feature?.geometry as { coordinates?: [number, number] }
			)?.coordinates;
			const source = map.getSource(sourceId) as GeoJSONSource | undefined;

			onClusterClick?.(clusterId, event);

			if (!coordinates || !source) return;

			void source.getClusterExpansionZoom(clusterId).then((zoom) => {
				map.easeTo({ center: coordinates, zoom });
			});
		};
		const handleMarkerClick = (event: MapLibreGL.MapLayerMouseEvent) => {
			const markerId = String(event.features?.[0]?.properties?.markerId);
			const marker = markerLookup.get(markerId);
			if (marker) onMarkerClick?.(marker, event);
		};
		const setPointer = () => {
			map.getCanvas().style.cursor = "pointer";
		};
		const resetPointer = () => {
			map.getCanvas().style.cursor = "";
		};

		map.on("click", clustersLayerId, handleClusterClick);
		map.on("click", unclusteredLayerId, handleMarkerClick);
		map.on("mouseenter", clustersLayerId, setPointer);
		map.on("mouseenter", unclusteredLayerId, setPointer);
		map.on("mouseleave", clustersLayerId, resetPointer);
		map.on("mouseleave", unclusteredLayerId, resetPointer);

		return () => {
			map.off("click", clustersLayerId, handleClusterClick);
			map.off("click", unclusteredLayerId, handleMarkerClick);
			map.off("mouseenter", clustersLayerId, setPointer);
			map.off("mouseenter", unclusteredLayerId, setPointer);
			map.off("mouseleave", clustersLayerId, resetPointer);
			map.off("mouseleave", unclusteredLayerId, resetPointer);
		};
	}, [
		clustersLayerId,
		isLoaded,
		map,
		markerLookup,
		onClusterClick,
		onMarkerClick,
		sourceId,
		unclusteredLayerId,
	]);

	return null;
}

export {
	Map,
	MapClusterLayer,
	MapControls,
	MapMarker,
	MarkerContent,
	MarkerPopup,
	useMap,
};

export type {
	MapClusterLayerProps,
	MapClusterMarker,
	MapProps,
	MapRef,
	MapViewport,
};
