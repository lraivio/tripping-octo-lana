//
//  ActionType.m
//  mobile
//
//  Created by Lauri Raivio on 9.1.2014.
//  Copyright (c) 2014 Lauri Raivio. All rights reserved.
//

#import "ActionType.h"

@implementation ActionType

- (NSString *)type
{
    if (!_type) _type = @"?";
    return _type;
}

- (NSString *)unit
{
    if (!_unit) _unit = @"?";
    return _unit;
}

- (NSInteger)lowerLimit
{
    if (!_lowerLimit) _lowerLimit = 0;
    return _lowerLimit;
}

- (NSInteger)upperLimit
{
    if (!_upperLimit) _upperLimit = 1;
    return _upperLimit;
}

- (NSString *)unitForCount
{
    if ([self.unit isEqualToString:@"km"]) {
        return self.unit;
    }
    return [NSString stringWithFormat:@" %@", self.unit];
}

- (NSString *)getTitle {
    return [self.type capitalizedString];
}

- (NSString *)getText {
    return self.type;
}


@end
