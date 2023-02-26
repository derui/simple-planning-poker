/**
 * component base interface
 */
export interface BaseProps {
  testid?: string;
}

/**
 * generateTestId with parent.
 */
export const generateTestId = function generateTestId(parentTestid: string | undefined) {
  return (key: string) => (parentTestid ? `${parentTestid}/${key}` : key);
};
