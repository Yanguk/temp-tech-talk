const STACK_LINE_REGEX = /(\d+):(\d+)\)?$/;

function lineLogger(...log: any) {
  let err: any;

  try {
    throw new Error();
  } catch (error) {
    err = error;
  }

  try {
    const stacks = err.stack.split('\n');
    const result = STACK_LINE_REGEX.exec(stacks[2]);

    if (!result) {
      throw new Error();
    }

    const [, line] = result;

    return this(`[line_${line}]`, ...log);
  } catch (err) {
    return this(...log);
  }
}

export const log = lineLogger.bind(console.log);
