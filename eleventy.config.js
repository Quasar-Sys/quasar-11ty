import path from 'node:path';
import * as sass from 'sass';

export default function (eleventyConfig) {
	eleventyConfig.setInputDirectory('src');
	eleventyConfig.setOutputDirectory('dist');

	eleventyConfig.addPassthroughCopy('src/assets/css');
	eleventyConfig.addPassthroughCopy('src/assets/js');
	eleventyConfig.addPassthroughCopy('src/assets/webfonts');
	eleventyConfig.addPassthroughCopy('src/images');

	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		useLayouts: false,
		compile: async function (inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			// Don’t compile file names that start with an underscore
			if (parsed.name.startsWith('_')) {
				return;
			}

			const compiled = sass.compileString(inputContent, {
				loadPaths: [parsed.dir || '.', this.config.dir.includes],
				// silenceDeprecations: ['import', 'global-builtin', 'slash-div']
			});

			// Map dependencies for incremental builds
			this.addDependencies(inputPath, compiled.loadedUrls);

			return async (data) => {
				return compiled.css;
			};
		},
	});

	eleventyConfig.addTemplateFormats('scss');
}