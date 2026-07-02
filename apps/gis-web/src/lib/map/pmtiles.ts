/**
 * Registers the `pmtiles://` protocol with MapLibre so a single PMTiles archive
 * can back a source, read by HTTP range requests. Imported for its side effect;
 * runs once before any terrain source loads.
 */
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'

const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)
