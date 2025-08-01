import { Text, View } from 'react-native';
import { EditScreenInfoProps } from './types';
import { styles } from './styles';

export const EditScreenInfo = ({ path }: EditScreenInfoProps) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  return (
    <View>
      <View className={styles.getStartedContainer}>
        <Text className={styles.getStartedText}>{title}</Text>
        <View className={styles.codeHighlightContainer + ' ' + styles.homeScreenFilename}>
          <Text>{path}</Text>
        </View>
        <Text className={styles.getStartedText}>{description}</Text>
      </View>
    </View>
  );
};

// 导出类型，方便其他地方使用
export type { EditScreenInfoProps } from './types';
