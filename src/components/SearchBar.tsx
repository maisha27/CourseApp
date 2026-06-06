import { memo, useEffect, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useCourseStore } from '../store/courseStore';

function SearchIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2" />
      <Path
        d="M21 21L16.65 16.65"
        stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round"
      />
    </Svg>
  );
}

function SearchBar() {
  const setSearchQuery = useCourseStore(state => state.setSearchQuery);
  const [localText, setLocalText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localText);
    }, 300);
    return () => clearTimeout(timer);
  }, [localText]);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.iconWrap}>
          <SearchIcon />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Search courses, instructors, tags..."
          placeholderTextColor="#9ca3af"
          value={localText}
          onChangeText={setLocalText}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

export default memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconWrap: {
    marginRight: 8,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
});
