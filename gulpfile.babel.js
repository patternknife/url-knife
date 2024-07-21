import gulp from 'gulp';
import mocha from 'gulp-mocha';
import babel from 'babel-register';


// Test
exports.default = () => (gulp.src('test/test.js', { read : false })
        .pipe(mocha({
            reporter: 'list',
            require: ['babel-core/register']
        }))
        .on('error', function(err) {
            this.emit('end');
        })
);

exports.test = () => (
    gulp.src(['test/test.js'], {read: false})
        .pipe(mocha({reporter: 'list',  require: ['babel-core/register'], exit: true}))
        .on('error', console.error)
);