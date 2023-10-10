import * as path from 'path';
import * as child_process from 'child_process';

export const convertWordFiles = async (pathFile: string, extOutput: string, outputDir: string, timeoutInSeconds: string): Promise<string> => {
  const system = process.platform;
  const extension = path.extname(pathFile);
  const fileName = path.basename(pathFile, extension);
  const fullName = path.basename(pathFile);
  const timeout = castToIntWithDefault(timeoutInSeconds)
  const convertCommandLinux = 'timeout ' + timeout + 's ' + `${path.resolve(__dirname, 'utils', 'instdir', 'program', 'soffice.bin')} --headless --norestore --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to ${extOutput} --outdir ${outputDir} '${pathFile}'`;
  const convertCommandWindows = `${path.resolve(__dirname, 'utils', 'LibreOfficePortable', 'App', 'libreoffice', 'program', 'soffice.bin')} --headless --norestore --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to ${extOutput} --outdir ${outputDir} "${pathFile}"`;

  if (!fullName.match(/\.(doc|docx|pdf|odt|txt)$/i)) {
    throw new Error('Invalid file format, see the documentation for more information.');
  } else if (!extOutput.match(/(doc|docx|pdf|odt|txt)$/)) {
    throw new Error('Format to be converted not accepted');
  }

  try {
    if (system === 'linux') { child_process.execSync(convertCommandLinux).toString('utf8') }
    if (system === 'win32') { child_process.execSync(convertCommandWindows).toString('utf8') }
  } catch (e) {
    console.error('convertWordFiles:', e);
    throw new Error('Error converting the file');
  }

  return path.join(outputDir, `${fileName}.${extOutput}`);
}

const castToIntWithDefault = (s: string) => {
  const value = Number(s);
  if (isNaN(value)) {
    return 10;
  }
  return value;
}
