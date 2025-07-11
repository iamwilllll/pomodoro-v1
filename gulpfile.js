// cssnano gulp gulp-postcss gulp-prettier gulp-replace gulp-sass gulp-terser gulp-typescript postcss prettier sass sharp

// Import necessary modules
import * as dartSass from 'sass'; // Dart Sass for SCSS compilation
import gulpSass from 'gulp-sass'; // Gulp integration with Sass
import terser from 'gulp-terser'; // For minifying JS files
import sharp from 'sharp'; // For image manipulation
import path from 'path'; // For handling file paths
import fs from 'fs'; // To work with the filesystem
import { exec } from 'child_process'; // To execute external commands (Prettier)

import { src, dest, watch, series } from 'gulp'; // Main Gulp methods

import postcss from 'gulp-postcss'; // PostCSS for CSS processing
import cssnano from 'cssnano'; // CSS minifier with PostCSS
import replace from 'gulp-replace'; // For replacements in streams (modify paths)

const sass = gulpSass(dartSass); // Initialize gulp-sass with Dart Sass

// Task to compile JavaScript files, minify them, and save output
export function compileJS() {
    return src('src/scripts/**/*.js') // Select all TS files in scripts folder
        .pipe(terser()) // Minify the resulting JS
        .pipe(dest('build/JavaScript')); // Save compiled files
}

// Task to compile SCSS to CSS, minify it and generate sourcemaps
export function css() {
    return src('src/styles/index.scss', { sourcemaps: true }) // Main SCSS file
        .pipe(sass().on('error', sass.logError)) // Compile SCSS to CSS, handle errors
        .pipe(postcss([cssnano()])) // Minify CSS using cssnano
        .pipe(dest('build/css', { sourcemaps: '.' })); // Save CSS with sourcemaps
}

// Task to process images: convert formats and optionally crop if specified
export async function crop() {
    const folders = ['src/assets/images', 'build/images/webp', 'build/images/png', 'build/images/jpg', 'build/images/ico', 'build/images/svg', 'build/images/crop/webp', 'build/images/crop/png', 'build/images/crop/jpg'];

    const cropWidth = null; // Width for cropping, change if cropping needed
    const cropHeight = null; // Height for cropping, change if cropping needed

    // Create folders if they don't exist
    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    });

    // Read JPG and PNG images from source folder
    const images = fs.readdirSync('src/assets/images').filter(file => /\.(jpg|png)$/i.test(file));

    try {
        for (const file of images) {
            const inputFile = path.join('src/assets/images', file);
            const fileName = path.parse(file).name;

            // Convert and save in different formats without cropping
            await sharp(inputFile).toFormat('webp', { quality: 99 }).toFile(`build/images/webp/${fileName}.webp`);
            await sharp(inputFile).toFormat('png', { quality: 99 }).toFile(`build/images/png/${fileName}.png`);
            await sharp(inputFile).toFormat('jpeg', { quality: 99 }).toFile(`build/images/jpg/${fileName}.jpg`);

            // If crop dimensions defined, resize and crop images
            if (cropWidth && cropHeight) {
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('webp', { quality: 99 }).toFile(`build/images/crop/webp/${fileName}-crop.webp`);
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('png', { quality: 99 }).toFile(`build/images/crop/png/${fileName}-crop.png`);
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('jpeg', { quality: 99 }).toFile(`build/images/crop/jpg/${fileName}-crop.jpg`);
            }
        }

        // Copy icons and SVG images without modification
        src('src/assets/images/**/*.ico').pipe(dest('build/images/ico'));
        src('src/assets/images/**/*.svg').pipe(dest('build/images/svg'));
        src('src/assets/icons/**/*.svg').pipe(dest('build/images/svg'));

        // Copy WebP images directly without conversion
        src('src/assets/images/**/*.webp').pipe(dest('build/images/webp'));
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

// Runs Prettier to format code based on .prettierrc config
export function format(cb) {
    exec('prettier --write .', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
}

// Copies HTML files from public folder to build folder
export function html() {
    return src('public/**/*.html').pipe(dest('build'));
}

// Fixes paths in HTML files: removes '/build' prefix from href and src attributes
// For example: href="/build/css/style.css" -> href="/css/style.css"
export function fixPaths() {
    return (
        src('build/**/*.html')
            // Remove '/build' prefix from href attributes
            .pipe(replace(/href="\/build([^"]*)"/g, 'href="$1"'))
            // Remove '/build' prefix from src attributes
            .pipe(replace(/src="\/build([^"]*)"/g, 'src="$1"'))
            // Remove '/build' prefix from srcset attributes
            .pipe(replace(/srcset="\/build([^"]*)"/g, 'srcset="$1"'))
            .pipe(dest('build'))
    );
}

// Watcher task for development: watches SCSS, TS, images, and HTML files
export function dev() {
    watch('src/styles/**/*.scss', css);
    watch('src/scripts/**/*.js', compileJS);
    watch('src/assets/images/**', crop);
    watch('public/**/*.html', html);
}

// Build task runs all functions in series, including path fixing
/* for deploy */
export const deploy = series(format, crop, compileJS, css, html, fixPaths);

/* for developing */
export const build = series(format, crop, compileJS, css, html, fixPaths, dev);

// Export build as default task
export default build;
