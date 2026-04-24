# Éléments à fournir — bikementor.fr

Ce document liste tout ce qu'il faut fournir pour remplacer les contenus provisoires du site.
Les placeholders sont actuellement en ligne sur le staging Vercel.

---

## 1. Médias (fichiers à déposer dans `public/`)

| Fichier | Format attendu | Dimensions | Description |
|---------|---------------|------------|-------------|
| `coach.webp` | WebP (ou JPEG) | 320×320 px minimum, carré | Photo du coach en plein air, fond naturel. Remplace `coach.svg`. |
| `posters/hero.webp` | WebP (ou JPEG) | 1920×1080 px | Image de couverture du héro (fond vidéo sur mobile et si vidéo désactivée). Remplace `posters/hero.svg`. |
| `videos/hero.mp4` | MP4 (H.264) | 1920×1080, < 15 Mo | Vidéo d'ambiance pour le héro desktop. Boucle silencieuse. |
| `og-cover.jpg` | JPEG | 1200×630 px | Image de partage réseaux sociaux (OG / Twitter Card). Remplace `og-cover.svg`. |
| `apple-touch-icon.png` | PNG | 180×180 px | Icône pour Safari iOS. Remplace `apple-touch-icon.svg`. |

> **Note vidéo :** si aucune vidéo n'est disponible, le site affichera simplement la photo héro (`posters/hero.webp`).

---

## 2. Contenu texte (fichier `src/lib/content/coach.js`)

| Champ | Valeur actuelle | À remplacer par |
|-------|----------------|-----------------|
| `credentials` | `'TODO confirmer le diplôme BE/DE VTT'` | Ex : `'BE VTT'`, `'Moniteur fédéral'`, diplômes obtenus |
| `bio` | `'TODO rédiger 2-3 lignes de bio'` | 2–3 phrases : parcours, spécialité, zone. Ex : *"Pilote trial professionnel depuis 2012…"* |
| `socials.instagram` | `'TODO fournir l\'URL'` | URL complète, ex : `'https://www.instagram.com/theop_vtt'` |
| `socials.facebook` | `'TODO fournir l\'URL'` | URL complète, ex : `'https://www.facebook.com/bikementor'` |

---

## 3. Configuration Google Reviews (`src/lib/config.js`)

| Champ | Valeur actuelle | À remplacer par |
|-------|----------------|-----------------|
| `placeId` | `'TODO renseigner le Google Place ID'` | L'ID Google Maps du lieu. Rechercher sur [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder). Ex : `'ChIJN1t_tDeuEmsRUsoyG83frY4'` |

---

## 4. Variable d'environnement Vercel

| Variable | Valeur | Où configurer |
|----------|--------|---------------|
| `GOOGLE_PLACES_API_KEY` | Clé API Google Places (New) | Dashboard Vercel → Settings → Environment Variables → Production + Preview |

La clé doit avoir accès à l'API **Places API (New)**. La créer sur [Google Cloud Console](https://console.cloud.google.com/).

---

## 5. Après avoir fourni les fichiers

Pour chaque fichier média remplacé, mettre à jour la référence dans le code :

| Placeholder actuel | Fichier final | Fichier à modifier |
|--------------------|--------------|-------------------|
| `/coach.svg` | `/coach.webp` | `src/lib/content/coach.js` ligne 3 |
| `/posters/hero.svg` | `/posters/hero.webp` | `src/components/sections/Hero.jsx` lignes 24 et 35 |
| `/og-cover.svg` | `/og-cover.jpg` | `index.html` balise `og:image` |
| `/apple-touch-icon.svg` | `/apple-touch-icon.png` | `index.html` balise `apple-touch-icon` |

---

## 6. Récapitulatif des URLs des profils sociaux déjà configurés

| Réseau | URL |
|--------|-----|
| WhatsApp | `https://wa.me/message/CPLLJRUYZ43DB1` |
| YouTube | `https://www.youtube.com/channel/UCSWGp0nrUZ1AuUmXJXZa1VQ` |
| Instagram | ⚠ À fournir |
| Facebook | ⚠ À fournir |
