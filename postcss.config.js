module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('postcss-preset-env')({
      stage: 1,
      browsers: 'last 2 versions',
    }),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' &&
      require('cssnano')({
        preset: 'default',
      }),
  ],
}
