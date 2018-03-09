/// <reference types="ioredis" />
import { Option } from 'funfix-core';
import * as Redis from 'ioredis';
export default function (redis: Redis.Redis, word: string): Promise<Option<string>>;
