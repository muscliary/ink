import Yoga from 'yoga-layout-prebuilt';

export default (yogaNode: Yoga.YogaNode) => {
	return (
		yogaNode.getComputedWidth() -
		yogaNode.getComputedPadding(Yoga.EDGE_LEFT) -
		yogaNode.getComputedPadding(Yoga.EDGE_RIGHT)
	);
};
