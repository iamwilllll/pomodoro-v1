// cssnano gulp gulp-postcss gulp-prettier gulp-replace gulp-sass gulp-terser postcss prettier sass sharp
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import terser from 'gulp-terser';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

import { src, dest, watch, series } from 'gulp';

import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import replace from 'gulp-replace';

const sass = gulpSass(dartSass); // Initialize gulp-sass with Dart Sass

// Task to compile and minify JavaScript files
export function compileJS() {
    return src('src/scripts/**/*.js').pipe(terser()).pipe(dest('build/JavaScript'));
}

// Task to compile SCSS, minify it, and generate sourcemaps
export function css() {
    return src('src/styles/index.scss', { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([cssnano()]))
        .pipe(dest('build/css', { sourcemaps: '.' }));
}

// Task to convert and optionally crop images
export async function crop() {
    const folders = ['src/assets/images', 'build/images/webp', 'build/images/png', 'build/images/jpg', 'build/images/ico', 'build/images/svg', 'build/images/crop/webp', 'build/images/crop/png', 'build/images/crop/jpg'];

    const cropWidth = null; // Set crop width if needed
    const cropHeight = null; // Set crop height if needed

    // Ensure required folders exist
    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    });

    // Get all JPG and PNG images
    const images = fs.readdirSync('src/assets/images').filter(file => /\.(jpg|png)$/i.test(file));

    try {
        for (const file of images) {
            const inputFile = path.join('src/assets/images', file);
            const fileName = path.parse(file).name;

            // Convert images to multiple formats
            await sharp(inputFile).toFormat('webp', { quality: 99 }).toFile(`build/images/webp/${fileName}.webp`);
            await sharp(inputFile).toFormat('png', { quality: 99 }).toFile(`build/images/png/${fileName}.png`);
            await sharp(inputFile).toFormat('jpeg', { quality: 99 }).toFile(`build/images/jpg/${fileName}.jpg`);

            // Crop if dimensions are defined
            if (cropWidth && cropHeight) {
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('webp', { quality: 99 }).toFile(`build/images/crop/webp/${fileName}-crop.webp`);
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('png', { quality: 99 }).toFile(`build/images/crop/png/${fileName}-crop.png`);
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('jpeg', { quality: 99 }).toFile(`build/images/crop/jpg/${fileName}-crop.jpg`);
            }
        }
    } catch (error) {
        console.error('Error processing images:', error);
    }

    // Copy additional static image assets if they exist
    if (fs.existsSync('src/assets/icons')) {
        src('src/assets/icons/**/*.svg').pipe(dest('build/images/svg'));
    }

    if (fs.existsSync('src/assets/images')) {
        src('src/assets/images/**/*.ico').pipe(dest('build/images/ico'));
        src('src/assets/images/**/*.svg').pipe(dest('build/images/svg'));
        src('src/assets/images/**/*.webp').pipe(dest('build/images/webp'));
    }
}

// Run Prettier using project settings
export function format(cb) {
    exec('prettier --write .', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
}

// Copy HTML files from /public to /build
export function html() {
    return src('public/**/*.html').pipe(dest('build'));
}

// Remove `/build` from paths inside HTML files
export function fixPaths() {
    return src('build/**/*.html')
        .pipe(replace(/href="\/build([^"]*)"/g, 'href="$1"'))
        .pipe(replace(/src="\/build([^"]*)"/g, 'src="$1"'))
        .pipe(replace(/srcset="\/build([^"]*)"/g, 'srcset="$1"'))
        .pipe(dest('build'));
}

// Watch source files for changes during development
export function dev() {
    watch('src/styles/**/*.scss', css);
    watch('src/scripts/**/*.js', compileJS);
    watch('src/assets/images/**', crop);
    watch('public/**/*.html', html);
}

// Main tasks
export const deploy = series(format, crop, compileJS, css, html, fixPaths); // For production
export const build = series(format, crop, compileJS, css, html, fixPaths, dev); // For development

// Default task
export default build;
