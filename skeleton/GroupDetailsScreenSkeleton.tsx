import { ScrollView, View } from 'react-native';

const SkeletonItem = ({ width, height, borderRadius = 6, style = {} }) => (
  <View
    style={{
      backgroundColor: '#E5E7EB',
      width,
      height,
      borderRadius,
      marginBottom: 10,
      ...style,
    }}
  />
);

const GroupDetailsSkeleton = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingTop:20, paddingBottom:20 }}>
      
{/*     
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SkeletonItem width={24} height={24} borderRadius={4} />
        <View>
          <SkeletonItem width={120} height={18} />
          <SkeletonItem width={80} height={12} />
        </View>
        <SkeletonItem width={20} height={20} borderRadius={4} />
      </View> */}

     
      {/* <View style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      }}>
        <SkeletonItem width={100} height={14} />
        <SkeletonItem width={60} height={18} />
        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 }} />

        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SkeletonItem width={24} height={24} borderRadius={12} style={{ marginRight: 8 }} />
              <SkeletonItem width={120} height={14} />
            </View>
            <SkeletonItem width={50} height={14} />
          </View>
        ))}
      </View> */}

      {/* Buttons Skeleton */}
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <SkeletonItem width={'48%'} height={40} borderRadius={8} />
        <SkeletonItem width={'48%'} height={40} borderRadius={8} />
      </View> */}

      {/* Transactions Skeleton */}
      {[...Array(3)].map((_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOpacity: 0.03,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <SkeletonItem width={140} height={14} />
          <SkeletonItem width={80} height={12} />
          <SkeletonItem width={'100%'} height={20} borderRadius={8} style={{ marginTop: 8 }} />
        </View>
      ))}

    </ScrollView>
  );
};

export default GroupDetailsSkeleton;
